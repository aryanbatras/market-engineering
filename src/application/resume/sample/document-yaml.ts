import { stringify } from "yaml"
import { sampleDocument } from "./sample-portfolio"

export const sampleDocumentYaml = stringify(sampleDocument(), { lineWidth: 0 })

export const slimDocumentYaml = stringify(
  {
    portfolioVersion: sampleDocument().portfolioVersion,
    identity: sampleDocument().identity,
    links: sampleDocument().links,
    education: sampleDocument().education.slice(0, 1),
    experience: sampleDocument().experience.slice(0, 1),
  },
  { lineWidth: 0 },
)