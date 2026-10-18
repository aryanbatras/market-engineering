import type { PublishedPortfolio } from "../portfolio.schema"

export type SavePortfolioInput = {
  handle: string
  templateId: string
  config: PublishedPortfolio["config"]
  data: PublishedPortfolio["data"]
  visibility: "public" | "private" | "unlisted"
  userId: string
}

export type PortfolioRepository = {
  findByHandle: (handle: string) => Promise<PublishedPortfolio | null>
  findByUser: (userId: string) => Promise<PublishedPortfolio | null>
  isHandleAvailable: (handle: string) => Promise<boolean>
  save: (input: SavePortfolioInput) => Promise<PublishedPortfolio>
  unpublish: (handle: string) => Promise<void>
  remove: (handle: string) => Promise<void>
  isMocked: boolean
}