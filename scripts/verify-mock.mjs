const store = new Map()
globalThis.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
}

const { mockDatabase } = await import('../src/infrastructure/mock/mock-database.ts')
const { mockAuthGateway } = await import('../src/infrastructure/mock/core-mock-auth-gateway.ts')
const { mockPortfolioRepository } = await import('../src/infrastructure/mock/portfolio/mock-portfolio-repository.ts')
const { seedMockDatabase } = await import('../src/infrastructure/mock/portfolio/seed.ts')
const { default: mockUser } = await import('../src/infrastructure/mock/fixtures/user.json', { with: { type: 'json' } }).then((m) => ({ default: m.default }))
const { samplePortfolio } = await import('../src/application/portfolio/sample-portfolio.ts')

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

const { mockResumeCompiler } = await import('../src/infrastructure/mock/resume/mock-resume-compiler.ts')
const { checkResume } = await import('../src/application/resume/check-resume.ts')
const { renderResume } = await import('../src/application/resume/render-resume.ts')
const { resumeLayoutSpecs, defaultResumeLayout, defaultResumeSkin } = await import('../src/application/resume/resume-registry.ts')
const { sampleDocument } = await import('../src/application/resume/sample/sample-portfolio.ts')

const resumePortfolio = sampleDocument()
const rendered = renderResume(resumePortfolio, defaultResumeLayout, defaultResumeSkin)
const atsBlock = ['\\usepackage[T1]{fontenc}', '\\usepackage{lmodern}', '\\usepackage{cmap}']

check("resume emits a document", rendered.tex.startsWith('\\documentclass'))
check("resume preamble carries the whole ATS block", atsBlock.every((line) => rendered.tex.includes(line)))
check("resume emits no icon-font glyphs", !rendered.tex.includes('fontawesome') && !rendered.tex.includes('\\fa'))
check("every layout renders", resumeLayoutSpecs.every((spec) => renderResume(resumePortfolio, spec, defaultResumeSkin).tex.length > 1200))
check("two-column layouts declare themselves unclean", resumeLayoutSpecs.filter((s) => s.columns === 2).every((s) => s.atsClean === false))

const body = rendered.tex.slice(rendered.tex.indexOf('\\begin{document}'))
check("user data escapes every LaTeX special", body.includes('\\%') && !/\d%/.test(body) && !/\d_/.test(body))

const { escapeTex } = await import('../src/application/resume/latex/escape-tex.ts')
const hostile = '100% of {effort} & $5 #1 ~2^3 _x_ \\end{}\\ textperiod · en–dash'
const escaped = escapeTex(hostile)
check("escapeTex neutralises every special", !/[^\\][&%$#^_~{}]/.test(escaped.replace(/\\[a-zA-Z]+(\{\})?/g, '')))
check("escapeTex keeps the dash as LaTeX", escapeTex('a–b') === 'a--b' && escapeTex('a—b') === 'a---b')
check("escapeTex does not escape its own output", !escaped.includes('textbackslash{}text'))

const compiled = await mockResumeCompiler.compile(
  { layout: rendered.layout, spec: defaultResumeLayout, skin: defaultResumeSkin },
  { timeoutMs: 1000 },
)
check("mock compiler returns a pdf", compiled.ok === true && compiled.pdf.length > 0)

const { unpdfTextExtractor } = await import('../src/infrastructure/resume/unpdf-text-extractor.ts')
const extracted = await unpdfTextExtractor.extractText(rendered.pdf)
check("the generated PDF has a real text layer", extracted.includes('Naina Kumari'), `${extracted.length} chars`)
check("the PDF text layer keeps the email intact", /nainakumari@example\.com/.test(extracted))
check("the PDF text layer keeps dates intact", /May 2026 . Aug 2026/.test(extracted))
check("the PDF text layer has no ligature damage", !/[ﬁﬂﬀﬃﬄ]/.test(extracted))
const lower = extracted.toLowerCase()
check(
  "the PDF text layer carries every heading",
  ['Internships', 'Projects', 'Education', 'Skills', 'Achievements'].every((h) => lower.includes(h.toLowerCase())),
)
check("the PDF is one page of real text", rendered.pages === 1 && extracted.replace(/\s+/g, '').length > 600, `pages=${rendered.pages}`)

const pdf = rendered.pdf
const report = await checkResume(resumePortfolio, defaultResumeLayout, defaultResumeSkin, unpdfTextExtractor, pdf)
check("ATS check passes against the real PDF", report.passed === true)
check("ATS check finds no failures on a clean layout", report.findings.filter((f) => f.severity === 'failure').length === 0)

const everyLayoutParses = []
for (const spec of resumeLayoutSpecs) {
  const out = renderResume(resumePortfolio, spec, defaultResumeSkin)
  const text = await unpdfTextExtractor.extractText(out.pdf)
  everyLayoutParses.push(text.includes('Naina Kumari') && out.pdf.length > 1200)
}
check("every one of the ten layouts emits a readable PDF", everyLayoutParses.every(Boolean), `${everyLayoutParses.filter(Boolean).length}/10`)

const withMetrics = (metrics) =>
  renderResume(resumePortfolio, defaultResumeLayout, {
    ...defaultResumeSkin,
    metrics: { ...defaultResumeSkin.metrics, ...metrics },
  })

const xOffsetOf = (pdf) => {
  const text = new TextDecoder().decode(pdf)
  const xs = [...text.matchAll(/1 0 0 1 ([\d.]+) [\d.]+ Tm/g)].map((m) => Number.parseFloat(m[1]))
  return xs.length === 0 ? -1 : Math.min(...xs)
}

const nameSizeOf = (pdf) => {
  const text = new TextDecoder().decode(pdf)
  const match = text.match(/\/F2 ([\d.]+) Tf/)
  return match ? Number.parseFloat(match[1]) : -1
}

const secondHeadingY = (pdf) => {
  const text = new TextDecoder().decode(pdf)
  const ys = [...text.matchAll(/1 0 0 1 [\d.]+ ([\d.]+) Tm/g)].map((m) => Number.parseFloat(m[1]))
  return ys[4] ?? -1
}

const margins = [0.8, 1.9, 3.2].map((pageMargin) => xOffsetOf(withMetrics({ pageMargin }).pdf))
check("the page margin control moves the text origin", margins[0] < margins[1] && margins[1] < margins[2], JSON.stringify(margins))

const sizes = [7, 10, 14].map((bodySize) =>
  nameSizeOf(withMetrics({ bodySize, nameSize: bodySize * 2 }).pdf),
)
check("the body size control scales the type", sizes[0] < sizes[1] && sizes[1] < sizes[2], JSON.stringify(sizes))

const entrySizes = [7, 10, 14].map((bodySize) => {
  const text = new TextDecoder().decode(withMetrics({ bodySize }).pdf)
  return text.includes(`/F2 ${(bodySize + 0.5).toFixed(2)} Tf`) ? bodySize : -1
})
check(
  "the body size control reaches the entry titles",
  entrySizes.every((value) => value > 0),
  JSON.stringify(entrySizes),
)

const nameSizes = [12, 21, 40].map((nameSize) => nameSizeOf(withMetrics({ nameSize }).pdf))
check("the name size control scales the name", nameSizes[0] < nameSizes[1] && nameSizes[1] < nameSizes[2], JSON.stringify(nameSizes))

const gaps = [0, 2.6, 8].map((sectionGap) => secondHeadingY(withMetrics({ sectionGap }).pdf))
check("the section gap control moves the second heading", gaps[0] > gaps[1] && gaps[1] > gaps[2], JSON.stringify(gaps))

const rules = [true, false].map((headingRule) =>
  new TextDecoder().decode(withMetrics({ headingRule }).pdf).split(" w\n").length,
)
check("the section rule toggle changes the bytes", rules[0] !== rules[1], JSON.stringify(rules))

const bullets = ["none", "dash", "dot"].map((bulletStyle) =>
  new TextDecoder().decode(withMetrics({ bulletStyle }).pdf).length,
)
check(
  "the bullet mark control changes the bytes",
  new Set(bullets).size === 3,
  JSON.stringify(bullets),
)

const { extractText, getDocumentProxy } = await import('unpdf')
const stillText = await extractText(await getDocumentProxy(new Uint8Array(rendered.pdf)), { mergePages: false })
check("the PDF is readable by a standard parser", typeof stillText === 'object' && Array.isArray(stillText.text) && stillText.totalPages === 1)
check("ATS check reports no ligature damage", !report.findings.some((f) => f.check === 'ligature'))
check("ATS check finds a clean email", !report.findings.some((f) => f.check === 'clean-email'))
check("ATS check does not warn on one column", !report.findings.some((f) => f.check === 'column-order'))

const twoColumn = resumeLayoutSpecs.find((spec) => spec.columns === 2)
const railReport = await checkResume(resumePortfolio, twoColumn, defaultResumeSkin, unpdfTextExtractor, pdf)
check("two-column layout warns about column order", railReport.findings.some((f) => f.check === 'column-order'))
check("a warning does not fail the document", railReport.passed === true)

console.log("")
