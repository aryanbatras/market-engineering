import type { PublishedPortfolio } from "../portfolio/portfolio.schema"

export type SavePortfolioInput = {
  handle: string
  templateId: string
  config: PublishedPortfolio["config"]
  data: PublishedPortfolio["data"]
  visibility: PublishedPortfolio extends { visibility: infer V } ? V : "public" | "private"
}

export type PortfolioRepository = {
  findByHandle: (handle: string) => Promise<PublishedPortfolio | null>
  isHandleAvailable: (handle: string) => Promise<boolean>
  save: (input: SavePortfolioInput) => Promise<PublishedPortfolio>
  remove: (handle: string) => Promise<void>
  listRevisions: (handle: string) => Promise<PublishedPortfolio[]>
}
