import { stringify } from "yaml"
import { samplePortfolio } from "./sample-portfolio"

export const heroYaml = stringify(samplePortfolio, { lineWidth: 0 })
