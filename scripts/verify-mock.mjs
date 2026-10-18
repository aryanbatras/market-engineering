const store = new Map()
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
}

const { mockDatabase } = await import('/Users/aryan/Documents/nov/market-engineering/src/infrastructure/mock/mock-database.ts')
const { mockAuthGateway } = await import('/Users/aryan/Documents/nov/market-engineering/src/infrastructure/auth/mock-auth-gateway.ts')
const { mockPortfolioRepository } = await import('/Users/aryan/Documents/nov/market-engineering/src/infrastructure/persistence/mock-portfolio-repository.ts')
const { seedMockDatabase } = await import('/Users/aryan/Documents/nov/market-engineering/src/infrastructure/mock/seed.ts')
const { default: mockUser } = await import('/Users/aryan/Documents/nov/market-engineering/src/infrastructure/mock/fixtures/user.json', { with: { type: 'json' } }).then((m) => ({ default: m.default }))
const { samplePortfolio } = await import('/Users/aryan/Documents/nov/market-engineering/src/application/portfolio/sample-portfolio.ts')

const check = (label, value) => console.log(`${value ? "PASS" : "FAIL"}  ${label}`)

mockDatabase.reset()
check("reset clears every mock table", mockDatabase.select("users").length === 0)

seedMockDatabase()
const seeded = mockDatabase.select("users")
check("seed creates the mock Supabase user row", seeded.length === 1 && seeded[0].email === mockUser.email)
const seededHandle = mockDatabase.select("handles")[0]?.handle
check("seed creates a handle", Boolean(seededHandle) && seededHandle === samplePortfolio.meta?.handle)
check("seed creates a portfolio", mockDatabase.select("portfolios").length === 1)
check("seed creates an entitlement", mockDatabase.select("entitlements")[0]?.plan === "free")

const before = await mockAuthGateway.getSession()
check("no session before sign-in", before === null)

const session = await mockAuthGateway.signInWithProvider("github")
check("sign-in returns a session with a user", session.user.email === mockUser.email)
check("session user carries the GitHub identity", session.user.username === mockUser.user_metadata.preferred_username)
check("session user carries the provider", session.user.provider === "github")
check("session persists to storage", (await mockAuthGateway.getSession()) !== null)
check("getUser resolves after sign-in", (await mockAuthGateway.getUser())?.id === session.user.id)

const available = await mockPortfolioRepository.isHandleAvailable("a-brand-new-handle")
check("new handle is available", available === true)
check("taken handle is not available", (await mockPortfolioRepository.isHandleAvailable(seededHandle)) === false)
check("reserved word is not available", (await mockPortfolioRepository.isHandleAvailable("pricing")) === false)
check("bad characters are not available", (await mockPortfolioRepository.isHandleAvailable("Bad Handle")) === false)

const byUser = await mockPortfolioRepository.findByUser(session.user.id)
check("portfolio resolves by user id", byUser?.data.identity.name === samplePortfolio.identity.name)
check("portfolio resolves by handle", (await mockPortfolioRepository.findByHandle(seededHandle))?.templateId === "classic")

await mockPortfolioRepository.unpublish(seededHandle)
check("unpublish flips visibility", mockDatabase.select("portfolios")[0].visibility === "private")

await mockPortfolioRepository.remove(seededHandle)
check("remove clears the portfolio row", mockDatabase.select("portfolios").length === 0)
check("remove clears the handle row", mockDatabase.select("handles").length === 0)

await mockAuthGateway.signOut()
check("sign-out clears the session", (await mockAuthGateway.getSession()) === null)

const { mockResumeCompiler } = await import('/Users/aryan/Documents/nov/market-engineering/src/infrastructure/mock/mock-resume-compiler.ts')
const { mockPdfTextExtractor } = await import('/Users/aryan/Documents/nov/market-engineering/src/infrastructure/mock/mock-pdf-text-extractor.ts')
const { checkResume } = await import('/Users/aryan/Documents/nov/market-engineering/src/application/resume/check-resume.ts')
const { renderResume } = await import('/Users/aryan/Documents/nov/market-engineering/src/application/resume/render-resume.ts')
const { resumeLayoutSpecs, defaultResumeLayout, defaultResumeSkin } = await import('/Users/aryan/Documents/nov/market-engineering/src/application/resume/resume-registry.ts')
const { portfolioSchema } = await import('/Users/aryan/Documents/nov/market-engineering/src/application/portfolio/portfolio.schema.ts')
const { previewPortfolio } = await import('/Users/aryan/Documents/nov/market-engineering/src/application/portfolio/preview-portfolio.ts')

const resumePortfolio = portfolioSchema.parse(previewPortfolio)
const rendered = renderResume(resumePortfolio, defaultResumeLayout, defaultResumeSkin)
const atsBlock = ['\\usepackage[T1]{fontenc}', '\\usepackage{lmodern}', '\\usepackage{cmap}']

check("resume emits a document", rendered.tex.startsWith('\\documentclass'))
check("resume preamble carries the whole ATS block", atsBlock.every((line) => rendered.tex.includes(line)))
check("resume emits no icon-font glyphs", !rendered.tex.includes('fontawesome') && !rendered.tex.includes('\\fa'))
check("every layout renders", resumeLayoutSpecs.every((spec) => renderResume(resumePortfolio, spec, defaultResumeSkin).tex.length > 1200))
check("two-column layouts declare themselves unclean", resumeLayoutSpecs.filter((s) => s.columns === 2).every((s) => s.atsClean === false))

const body = rendered.tex.slice(rendered.tex.indexOf('\\begin{document}'))
check("user data escapes every LaTeX special", body.includes('\\%') && !/\d%/.test(body) && !/\d_/.test(body))

const { escapeTex } = await import('/Users/aryan/Documents/nov/market-engineering/src/application/resume/latex/escape-tex.ts')
const hostile = '100% of {effort} & $5 #1 ~2^3 _x_ \\end{}\\ textperiod · en–dash'
const escaped = escapeTex(hostile)
check("escapeTex neutralises every special", !/[^\\][&%$#^_~{}]/.test(escaped.replace(/\\[a-zA-Z]+(\{\})?/g, '')))
check("escapeTex keeps the dash as LaTeX", escapeTex('a–b') === 'a--b' && escapeTex('a—b') === 'a---b')
check("escapeTex does not escape its own output", !escaped.includes('textbackslash{}text'))

const compiled = await mockResumeCompiler.compile(rendered.tex, { timeoutMs: 1000 })
check("mock compiler returns a pdf", compiled.ok === true && compiled.pdf.length > 0)

const extracted = await mockPdfTextExtractor.extractText(new Uint8Array())
check("mock extractor returns text", extracted.includes('Naina Kumari'))

const pdf = compiled.ok ? compiled.pdf : new Uint8Array()
const report = await checkResume(resumePortfolio, defaultResumeLayout, defaultResumeSkin, mockPdfTextExtractor, pdf)
check("ATS check passes on a clean single-column layout", report.passed === true)
check("ATS check reports no ligature damage", !report.findings.some((f) => f.check === 'ligature'))
check("ATS check finds a clean email", !report.findings.some((f) => f.check === 'clean-email'))
check("ATS check does not warn on one column", !report.findings.some((f) => f.check === 'column-order'))

const twoColumn = resumeLayoutSpecs.find((spec) => spec.columns === 2)
const railReport = await checkResume(resumePortfolio, twoColumn, defaultResumeSkin, mockPdfTextExtractor, pdf)
check("two-column layout warns about column order", railReport.findings.some((f) => f.check === 'column-order'))
check("a warning does not fail the document", railReport.passed === true)

console.log("")
