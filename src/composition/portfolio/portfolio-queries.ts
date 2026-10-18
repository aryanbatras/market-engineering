import { createPortfolioQueries } from "@application/portfolio/portfolio-queries"
import { portfolioRepository } from "@infrastructure/portfolio/persistence/resolve-portfolio-repository"

export const portfolioQueries = createPortfolioQueries(portfolioRepository)

export const repositoryIsMocked = portfolioRepository.isMocked
