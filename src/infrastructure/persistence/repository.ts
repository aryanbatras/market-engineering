import type { PortfolioRepository } from "@application/ports/portfolio-repository"
import { localPortfolioRepository } from "./local-portfolio-repository"

const resolvePortfolioRepository = (): PortfolioRepository => localPortfolioRepository

export const portfolioRepository = resolvePortfolioRepository()

export const repositoryKind = "local" as const