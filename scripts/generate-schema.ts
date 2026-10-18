import { writeFileSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"
import { z } from "zod"
import { portfolioSchema, templateConfigSchema } from "../src/application/portfolio/portfolio.schema"

const dataDir = resolve(process.cwd(), "data")
mkdirSync(dataDir, { recursive: true })

const target = z.toJSONSchema(portfolioSchema, { target: "draft-2020-12" })
const config = z.toJSONSchema(templateConfigSchema, { target: "draft-2020-12" })

const document = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Market Engineering portfolio",
  ...target,
  $defs: {
    ...(target.$defs ?? {}),
    templateConfig: config,
  },
}

writeFileSync(resolve(dataDir, "portfolio.schema.json"), `${JSON.stringify(document, null, 2)}\n`)

const describeObject = (schema: Record<string, unknown>, indent = ""): string => {
  const properties = (schema.properties ?? {}) as Record<string, Record<string, unknown>>
  const required = new Set((schema.required ?? []) as string[])
  return Object.entries(properties)
    .map(([key, value]) => {
      const type = Array.isArray(value.type) ? value.type.join(" or ") : (value.type ?? "any")
      const flag = required.has(key) ? "required" : "optional"
      return `${indent}- **${key}** · ${type} · ${flag}`
    })
    .join("\n")
}

const root = target as Record<string, unknown>
const props = (root.properties ?? {}) as Record<string, Record<string, unknown>>
const itemOf = (key: string): Record<string, unknown> =>
  (props[key]?.items ?? {}) as Record<string, unknown>

const guide = `# Portfolio data format

The same schema our editor validates against. Paste this into any AI along with your
resume, or fill in the form and we generate it for you.

- Validated against \`data/portfolio.schema.json\`
- Only \`portfolioVersion\` and \`identity.name\` are required
- Dates are \`YYYY-MM\` or \`YYYY\`
- Set \`current: true\` instead of writing "Present" into a date

## Root

${describeObject(root)}

## identity

${describeObject(props.identity ?? {})}

## education

${describeObject(itemOf("education"))}

## experience

${describeObject(itemOf("experience"))}

## projects

${describeObject(itemOf("projects"))}

## links

${describeObject(itemOf("links"))}

## skills

${describeObject(itemOf("skills"))}

## Example

\`\`\`yaml
portfolioVersion: 1
identity:
  name: Ananya Krishnan
  headline: Computer science final year. Builds things that mostly work.
  location: Coimbatore, India
  email: ananya@example.com
  availability: Available from June 2027
links:
  - platform: github
    url: https://github.com/ananyak
education:
  - institution: Karpagam College of Engineering
    degree: B.Tech
    field: Computer Science
    start: "2023"
    end: "2027"
    current: true
    grade: CGPA 8.7
experience:
  - organisation: Zoho
    role: Software engineering intern
    start: 2026-05
    end: 2026-08
    summary: Built a reporting tool that replaced a spreadsheet.
    highlights:
      - Cut weekly report preparation from four hours to twenty minutes
projects:
  - name: Attendance without the queue
    description: A lab attendance register that stops the line at the door.
    tech: [Next.js, Postgres]
    timeline: "2026"
    featured: true
skills:
  - name: TypeScript
    group: Languages
\`\`\`
`

writeFileSync(resolve(dataDir, "portfolio.schema.md"), guide)

console.log("wrote data/portfolio.schema.json and data/portfolio.schema.md")
