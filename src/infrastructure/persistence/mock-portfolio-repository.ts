import { mockDatabase } from "../mock/mock-database"
import { seedMockDatabase } from "../mock/seed"
import type { PortfolioRepository, SavePortfolioInput } from "@application/ports/portfolio-repository"
import type { PublishedPortfolio } from "@application/portfolio/portfolio.schema"

type PortfolioRow = {
  handle: string
  user_id: string
  schema_version: 1
  template_id: string
  config: PublishedPortfolio["config"]
  data: PublishedPortfolio["data"]
  visibility: "public" | "private" | "unlisted"
  published_at: string | null
}

const RESERVED = new Set([
  "api",
  "builder",
  "credits",
  "dashboard",
  "features",
  "new",
  "pricing",
  "privacy",
  "sign-in",
  "signup",
  "standout",
  "templates",
  "terms",
])

const toRecord = (row: PortfolioRow): PublishedPortfolio => ({
  handle: row.handle,
  schemaVersion: 1,
  templateId: row.template_id,
  config: row.config,
  data: row.data,
  publishedAt: row.published_at ?? new Date().toISOString(),
})

const toRow = (input: SavePortfolioInput, publishedAt: string): PortfolioRow => ({
  handle: input.handle,
  user_id: input.userId,
  schema_version: 1,
  template_id: input.templateId,
  config: input.config,
  data: input.data,
  visibility: input.visibility,
  published_at: publishedAt,
})

export const mockPortfolioRepository: PortfolioRepository = {
  isMocked: true,

  findByHandle: async (handle) => {
    seedMockDatabase()
    const row = mockDatabase
      .select("portfolios")
      .find((item) => item.handle === handle.trim().toLowerCase()) as PortfolioRow | undefined
    return row ? toRecord(row) : null
  },

  findByUser: async (userId) => {
    seedMockDatabase()
    const row = mockDatabase
      .select("portfolios")
      .find((item) => item.user_id === userId) as PortfolioRow | undefined
    return row ? toRecord(row) : null
  },

  isHandleAvailable: async (handle) => {
    seedMockDatabase()
    const normalised = handle.trim().toLowerCase()
    if (normalised.length < 3) return false
    if (RESERVED.has(normalised)) return false
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalised)) return false
    return !mockDatabase.select("portfolios").some((item) => item.handle === normalised)
  },

  save: async (input) => {
    seedMockDatabase()
    const now = new Date().toISOString()
    const row = toRow(input, now)

    mockDatabase.insert("handles", {
      handle: row.handle,
      user_id: row.user_id,
      status: "active",
      created_at: now,
    })

    const existing = mockDatabase.select("portfolios").find((item) => item.handle === row.handle)
    if (existing) {
      mockDatabase.update("portfolios", { handle: row.handle }, row as unknown as Record<string, unknown>)
    } else {
      mockDatabase.insert("portfolios", row as unknown as Record<string, unknown>)
    }

    mockDatabase.insert("portfolio_revisions", {
      id: crypto.randomUUID(),
      handle: row.handle,
      schema_version: 1,
      data: row.data,
      created_at: now,
    })

    const revisions = mockDatabase.select("portfolio_revisions").filter((item) => item.handle === row.handle)
    if (revisions.length > 5) {
      const oldest = revisions.slice(0, revisions.length - 5)
      for (const revision of oldest) mockDatabase.remove("portfolio_revisions", { id: revision.id })
    }

    return toRecord(row)
  },

  unpublish: async (handle) => {
    mockDatabase.update("portfolios", { handle }, { visibility: "private", published_at: null })
  },

  remove: async (handle) => {
    mockDatabase.remove("portfolios", { handle })
    mockDatabase.remove("handles", { handle })
    mockDatabase.remove("portfolio_revisions", { handle })
  },
}