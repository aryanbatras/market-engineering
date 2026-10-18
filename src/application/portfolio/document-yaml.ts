import { stringify } from "yaml"
import { samplePortfolio } from "@application/portfolio/sample-portfolio"
import { portfolioSchema } from "@application/portfolio/portfolio.schema"
import type { Portfolio } from "@application/portfolio/portfolio.schema"

const source = portfolioSchema.parse(samplePortfolio)

const slimSource = {
  portfolioVersion: source.portfolioVersion,
  identity: source.identity,
  links: source.links,
  education: source.education.slice(0, 1),
  experience: source.experience.slice(0, 1),
}

export const heroYaml = stringify(slimSource, { lineWidth: 0 })

export const builderYaml = stringify(
  {
    portfolioVersion: source.portfolioVersion,
    identity: source.identity,
    links: source.links,
    education: source.education,
    experience: source.experience,
    projects: source.projects,
    skills: source.skills,
    languages: source.languages,
  },
  { lineWidth: 0 },
)

export type SampleDocument = Portfolio