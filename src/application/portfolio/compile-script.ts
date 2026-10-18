import { stringify } from "yaml"
import { samplePortfolio } from "./sample-portfolio"

const order = [
  "portfolioVersion",
  "identity",
  "links",
  "education",
  "experience",
  "projects",
  "skills",
] as const

type Pair = [string, unknown]

const asPair = (key: string): Pair => [key, samplePortfolio[key as keyof typeof samplePortfolio]]

const pairs: Pair[] = [
  asPair("portfolioVersion"),
  asPair("identity"),
  asPair("links"),
  asPair("education"),
  asPair("experience"),
  asPair("projects"),
  asPair("skills"),
]

const blockFor = (key: string, value: unknown, index: number): string[] => {
  const body = stringify({ [key]: value }, { lineWidth: 0 })
    .trimEnd()
    .split("\n")
  const indented = index === 0 ? body : body.map((line) => line)
  return indented
}

export const compileLines: string[] = pairs.flatMap(([key, value], index) => blockFor(key, value, index))

export const compileIntroLines: string[] = [
  "# Paste this into any AI with your resume and it comes back as YAML.",
]

export const fullCompileScript: string[] = [...compileIntroLines, ...compileLines]

export const templateOrder = order