import type { ResumeDocument, ResumeSection } from "../resume.schema"
import type { ResumeLayoutSpec } from "../resume-layout"
import type { AtsFinding, AtsReport } from "./ats-report"
import {
  containsLigatureGlyph,
  findEmail,
  firstIndexOf,
  firstLines,
  linesMatching,
  ligatureProneWords,
  normaliseText,
} from "./ats-text"

const nameFirst = (text: string, name: string): AtsFinding | null => {
  if (name.trim().length === 0) return null
  const head = firstLines(text, 3).join(" ").toLowerCase()
  if (head.includes(name.trim().toLowerCase())) return null
  return {
    check: "name-first",
    severity: "failure",
    message: `Your name is not in the first lines a parser reads. It should be the first thing on the page, above everything else.`,
  }
}

const cleanEmail = (text: string): AtsFinding | null => {
  const email = findEmail(text)
  if (email === null) {
    return {
      check: "clean-email",
      severity: "failure",
      message: "No email address was found in the text a parser reads. Check that it is in your contact line.",
    }
  }
  const line = linesMatching(text, email)[0] ?? ""
  const before = line.slice(0, line.toLowerCase().indexOf(email.toLowerCase()))
  const glued = /[^\s:|,;/]/.test(before)
  if (glued) {
    return {
      check: "clean-email",
      severity: "failure",
      message: "Something is sitting directly before your email address, so a parser may not recognise it. Put it on a clean line by itself.",
    }
  }
  return null
}

const datesAttached = (text: string, sections: ResumeSection[]): AtsFinding | null => {
  for (const section of sections) {
    if (section.kind !== "experience" && section.kind !== "education") continue
    for (const entry of section.entries) {
      if (entry.dates.length === 0) continue
      const line = linesMatching(text, entry.dates)[0]
      if (line === undefined) continue
      if (!line.toLowerCase().includes(entry.title.toLowerCase())) {
        return {
          check: "dates-attached",
          severity: "failure",
          message: `"${entry.title}" has its dates on a line of their own. Put the dates on the same line as the role, right-aligned.`,
        }
      }
    }
  }
  return null
}

const ligature = (text: string, document: ResumeDocument): AtsFinding | null => {
  if (containsLigatureGlyph(text)) {
    return {
      check: "ligature",
      severity: "failure",
      message:
        "Some words were typeset as ligature glyphs and do not extract as letters, so a keyword search will miss them. This layout must not typeset fi, fl or ff as single glyphs.",
    }
  }
  const haystack = text.toLowerCase()
  const source = normaliseText(JSON.stringify(document)).toLowerCase()
  const missing = ligatureProneWords.filter(
    (word) => source.includes(word) && !haystack.includes(word),
  )
  if (missing.length > 0) {
    return {
      check: "ligature",
      severity: "failure",
      message: `"${missing[0]}" is in your data but not in the extracted text. A keyword search for it will return nothing.`,
    }
  }
  return null
}

const plainHeadings = (text: string, document: ResumeDocument): AtsFinding | null => {
  const wanted = document.sections.map((section) => section.title).filter((title) => title.length > 0)
  const missing = wanted.filter((title) => !text.toLowerCase().includes(title.toLowerCase()))
  if (missing.length === 0) return null
  return {
    check: "plain-headings",
    severity: "failure",
    message: `"${missing[0]}" does not appear as plain text. Section headings need to be readable words, not styled glyphs.`,
  }
}

const readingOrder = (layout: ResumeLayoutSpec, text: string): AtsFinding | null => {
  if (layout.columns === 1) return null
  const order: string[] = []
  if (layout.order.includes("experience")) order.push(layout.experienceTitle)
  if (layout.order.includes("projects")) order.push(layout.projectsTitle)
  if (layout.order.includes("education")) order.push(layout.educationTitle)
  let previous = -1
  for (const title of order) {
    const at = firstIndexOf(text, [title])
    if (at === -1) continue
    if (previous !== -1 && at < previous) {
      return {
        check: "reading-order",
        severity: "warning",
        message: `"${layout.name}" is two columns, so a parser reads one column before the other and the sections come out in a different order than they appear. Switch to a single-column layout if a parser reading this correctly matters more than how it looks.`,
      }
    }
    previous = at
  }
  return null
}

const columnOrder = (layout: ResumeLayoutSpec): AtsFinding | null =>
  layout.columns === 2
    ? {
        check: "column-order",
        severity: "warning",
        message: `${layout.name} is a two-column layout. It reads beautifully to a person and is reordered by a parser. The extracted text below is exactly what the machine gets.`,
      }
    : null

export const runAtsCheck = (
  document: ResumeDocument,
  text: string,
  layout: ResumeLayoutSpec,
): AtsReport => {
  const findings: AtsFinding[] = [
    nameFirst(text, document.name),
    cleanEmail(text),
    datesAttached(text, document.sections),
    ligature(text, document),
    plainHeadings(text, document),
    columnOrder(layout),
    readingOrder(layout, text),
  ].filter((finding): finding is AtsFinding => finding !== null)

  return {
    findings,
    text: normaliseText(text),
    passed: findings.every((finding) => finding.severity !== "failure"),
  }
}