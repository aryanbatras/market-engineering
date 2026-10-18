import type { PublishedPortfolio } from "@application/portfolio/portfolio.schema"
import type { PortfolioRepository, SavePortfolioInput } from "@application/ports/portfolio-repository"
import { samplePortfolio } from "@application/portfolio/sample-portfolio"
import { portfolioSchema } from "@application/portfolio/portfolio.schema"

const STORAGE_KEY = "market-engineering.portfolios"

const defaultConfig: PublishedPortfolio["config"] = {
  accent: "blue",
  density: "comfortable",
  dark: false,
}

const seed = (): PublishedPortfolio[] => [
  {
    handle: "ananya",
    schemaVersion: 1,
    templateId: "classic",
    config: defaultConfig,
    data: portfolioSchema.parse(samplePortfolio),
    publishedAt: new Date().toISOString(),
  },
]

const readStore = (): PublishedPortfolio[] => {
  if (typeof window === "undefined") return seed()
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === null) return seed()
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as PublishedPortfolio[]) : seed()
  } catch {
    return seed()
  }
}

const writeStore = (records: PublishedPortfolio[]): void => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

const RESERVED = new Set([
  "admin",
  "api",
  "builder",
  "dashboard",
  "features",
  "login",
  "new",
  "pricing",
  "privacy",
  "p",
  "signin",
  "signup",
  "templates",
  "terms",
])

export const localPortfolioRepository: PortfolioRepository = {
  isHandleAvailable: async (handle) => {
    const normalised = handle.trim().toLowerCase()
    if (normalised.length < 3 || RESERVED.has(normalised)) return false
    return !readStore().some((record) => record.handle === normalised)
  },

  findByHandle: async (handle) => {
    const normalised = handle.trim().toLowerCase()
    return readStore().find((record) => record.handle === normalised) ?? null
  },

  save: async (input: SavePortfolioInput) => {
    const record: PublishedPortfolio = {
      handle: input.handle,
      schemaVersion: 1,
      templateId: input.templateId,
      config: input.config,
      data: input.data,
      publishedAt: new Date().toISOString(),
    }
    const existing = readStore()
    writeStore([...existing.filter((item) => item.handle !== record.handle), record])
    return record
  },

  remove: async (handle) => {
    writeStore(readStore().filter((item) => item.handle !== handle))
  },

  listRevisions: async (handle) => readStore().filter((item) => item.handle === handle),
}