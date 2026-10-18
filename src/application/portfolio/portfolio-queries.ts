import type { PortfolioRepository } from "./ports/portfolio-repository"
import type { PublishedPortfolio } from "./portfolio.schema"
import { loadTemplate } from "@presentation/portfolio/templates/registry"

export type PortfolioQueries = {
  getPublishedPortfolio: (handle: string) => Promise<PublishedPortfolio | null>
}

export const createPortfolioQueries = (repository: PortfolioRepository): PortfolioQueries => ({
  getPublishedPortfolio: async (handle) => {
    const normalised = handle.trim().toLowerCase()
    const record = await repository.findByHandle(normalised)
    if (!record) return null
    return record
  },
})

export const renderTemplateFor = async (templateId: string) => await loadTemplate(templateId)

export const buildPersonJsonLd = (record: PublishedPortfolio) => {
  const { identity, education, skills, links } = record.data
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name,
    jobTitle: identity.headline ?? undefined,
    email: identity.email || undefined,
    url: `/p/${record.handle}`,
    alumniOf: education.map((item) => ({ "@type": "CollegeOrUniversity", name: item.institution })),
    knowsAbout: skills.map((skill) => skill.name),
    sameAs: links.map((link) => link.url),
  }
}
