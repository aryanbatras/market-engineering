import { parse as parseYaml } from "yaml"
import { portfolioSchema } from "./portfolio.schema"
import type { Portfolio } from "./portfolio.schema"

export type IssueField = string
export type IssueMessage = string
export type IssueLine = number | null

export type ValidationIssue = {
  field: IssueField
  message: IssueMessage
  line: IssueLine
}

export type ParseSuccess = {
  ok: true
  data: Portfolio
  issues: ValidationIssue[]
}

export type ParseFailure = {
  ok: false
  data: null
  issues: ValidationIssue[]
}

export type ParseResult = ParseSuccess | ParseFailure

const toFieldPath = (path: ReadonlyArray<PropertyKey>): IssueField => {
  const joined = path.map(String).join(".")
  return joined.length > 0 ? joined : "document"
}

export const parsePortfolioText = (text: string): ParseResult => {
  const trimmed = text.trim()

  if (trimmed.length === 0) {
    return {
      ok: false,
      data: null,
      issues: [{ field: "document", message: "Paste your YAML or JSON here to begin.", line: null }],
    }
  }

  let raw: unknown

  try {
    raw = JSON.parse(trimmed)
  } catch {
    try {
      raw = parseYaml(trimmed, { prettyErrors: true })
    } catch (error) {
      return {
        ok: false,
        data: null,
        issues: [
          {
            field: "document",
            message: error instanceof Error ? error.message : "That could not be parsed.",
            line: null,
          },
        ],
      }
    }
  }

  const result = portfolioSchema.safeParse(raw)

  if (result.success) {
    return { ok: true, data: result.data, issues: [] }
  }

  const issues = result.error.issues.map<ValidationIssue>((issue) => ({
    field: toFieldPath(issue.path),
    message: issue.message,
    line: null,
  }))

  return { ok: false, data: null, issues }
}

export const issuesFor = (result: ParseResult, field: IssueField): ValidationIssue[] =>
  result.issues.filter((issue) => issue.field === field || issue.field.startsWith(`${field}.`))

export const firstIssue = (result: ParseResult): ValidationIssue | null =>
  result.issues.length > 0 ? (result.issues[0] ?? null) : null

export const countIssues = (result: ParseResult): number => result.issues.length