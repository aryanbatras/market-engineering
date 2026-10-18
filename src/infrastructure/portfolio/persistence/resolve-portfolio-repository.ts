import type { PortfolioRepository } from "@application/portfolio/ports/portfolio-repository"
import { isMockEnvironment } from "@application/core/site/app-environment"
import { mockPortfolioRepository } from "../../mock/portfolio/mock-portfolio-repository"
import { createSupabasePortfolioRepository } from "./supabase-portfolio-repository"

const resolve = (): PortfolioRepository => {
  if (isMockEnvironment()) return mockPortfolioRepository
  return createSupabasePortfolioRepository() ?? mockPortfolioRepository
}

export const portfolioRepository = resolve()
