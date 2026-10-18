import type { PortfolioRepository } from "@application/ports/portfolio-repository"
import { isMockEnvironment } from "@application/site/app-environment"
import { mockPortfolioRepository } from "./mock-portfolio-repository"
import { createSupabasePortfolioRepository } from "./supabase-portfolio-repository"

const resolve = (): PortfolioRepository => {
  if (isMockEnvironment()) return mockPortfolioRepository
  return createSupabasePortfolioRepository() ?? mockPortfolioRepository
}

export const portfolioRepository = resolve()
