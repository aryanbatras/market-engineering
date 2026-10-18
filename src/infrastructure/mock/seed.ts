import mockUser from "./fixtures/user.json"
import mockGitHubProfile from "./fixtures/github-profile.json"
import mockEntitlement from "./fixtures/entitlement.json"
import mockSubscription from "./fixtures/razorpay-subscription.json"
import { mockDatabase } from "./mock-database"
import { samplePortfolio } from "@application/portfolio/sample-portfolio"
import { portfolioSchema, templateConfigSchema } from "@application/portfolio/portfolio.schema"

export const mockUserId = mockUser.id

const parsedSample = portfolioSchema.parse(samplePortfolio)

export const defaultConfig = templateConfigSchema.parse({})

export const githubProfile = mockGitHubProfile
export const razorpaySubscription = mockSubscription

export const seedMockDatabase = (): void => {
  const existing = mockDatabase.select("users")
  if (existing.length > 0) return

  mockDatabase.insert("users", { ...mockUser })
  mockDatabase.insert("entitlements", { ...mockEntitlement })
  mockDatabase.insert("handles", {
    handle: parsedSample.meta?.handle ?? "yourname",
    user_id: mockUserId,
    status: "active",
    created_at: mockUser.created_at,
  })
  mockDatabase.insert("portfolios", {
    handle: parsedSample.meta?.handle ?? "yourname",
    user_id: mockUserId,
    schema_version: 1,
    template_id: "classic",
    config: defaultConfig,
    data: parsedSample,
    visibility: "public",
    published_at: mockUser.created_at,
    created_at: mockUser.created_at,
    updated_at: mockUser.updated_at,
  })
}