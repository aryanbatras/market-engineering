export type AtsCheckId =
  | "name-first"
  | "clean-email"
  | "dates-attached"
  | "ligature"
  | "plain-headings"
  | "reading-order"
  | "column-order"

export type AtsSeverity = "failure" | "warning"

export type AtsFinding = {
  check: AtsCheckId
  severity: AtsSeverity
  message: string
}

export type AtsReport = {
  findings: AtsFinding[]
  text: string
  passed: boolean
}