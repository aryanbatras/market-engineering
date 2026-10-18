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
