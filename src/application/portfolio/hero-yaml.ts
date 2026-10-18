import { stringify } from "yaml"
import { samplePortfolio } from "./sample-portfolio"
import type { Portfolio } from "./portfolio.schema"

const source = samplePortfolio as Portfolio

const slimSource = {
  portfolioVersion: 1,
  identity: source.identity,
  links: source.links,
  education: source.education.slice(0, 1),
  experience: source.experience.slice(0, 1),
}

export const heroYaml = stringify(slimSource, { lineWidth: 0 })

export const builderYaml = stringify(
  {
    portfolioVersion: 1,
    identity: source.identity,
    links: source.links,
    education: source.education,
    experience: source.experience,
    projects: source.projects,
    skills: source.skills,
  },
  { lineWidth: 0 },
)