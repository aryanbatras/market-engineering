import { createPortfolioQueries } from "@application/portfolio/portfolio-queries"
import { portfolioRepository } from "@infrastructure/persistence/repository"

export const portfolioQueries = createPortfolioQueries(portfolioRepository)
