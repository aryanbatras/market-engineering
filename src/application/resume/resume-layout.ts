import type { ResumeSectionKind } from "./resume.schema"

export type ResumeHeadingStyle = "plain" | "rule" | "bar" | "caret"

export type ResumeNameStyle = "left" | "centred" | "boxed"

export type ResumeEntryStyle = "split" | "inline"

export type ResumeBulletStyle = "none" | "dash" | "dot"

export type ResumeNameBlock = {
  kind: "name"
  text: string
}

export type ResumeContactBlock = {
  kind: "contact"
  items: string[]
}

export type ResumeHeadingBlock = {
  kind: "heading"
  text: string
  style: ResumeHeadingStyle
}

export type ResumeEntryBlock = {
  kind: "entry"
  title: string
  organisation: string
  dates: string
  meta: string
  summary: string
  bullets: string[]
  style: ResumeEntryStyle
}

export type ResumeSkillsBlock = {
  kind: "skills"
  groups: { label: string; items: string[] }[]
}

export type ResumeNoteBlock = {
  kind: "note"
  text: string
}

export type ResumeBlock =
  | ResumeNameBlock
  | ResumeContactBlock
  | ResumeHeadingBlock
  | ResumeEntryBlock
  | ResumeSkillsBlock
  | ResumeNoteBlock

export type ResumeLayout = {
  id: string
  blocks: ResumeBlock[]
  railIndexes: number[]
}

export type ResumeHeaderAlign = "left" | "centred"

export type ResumeHeadlineStyle = "italic" | "bold"

export type ResumeContactSeparator = "dot" | "bar"

export type ResumeLayoutSpec = {
  id: string
  name: string
  forWhom: string
  summary: string
  columns: 1 | 2
  atsClean: boolean
  dialect: "pdftex" | "luatex"
  order: ResumeSectionKind[]
  rail: ResumeSectionKind[]
  summaryBlock: boolean
  headlineFirst: boolean
  experienceTitle: string
  educationTitle: string
  projectsTitle: string
  skillsTitle: string
  highlightsTitle: string
  nameStyle: ResumeNameStyle
  headerAlign: ResumeHeaderAlign
  headlineStyle: ResumeHeadlineStyle
  contactSeparator: ResumeContactSeparator
  headingCaps: boolean
  headingStyle: ResumeHeadingStyle
  headerRule: boolean
  entryStyle: ResumeEntryStyle
  bulletStyle: ResumeBulletStyle
  railTint: boolean
  railWidth: number
}

export type ResumeDensity = "compact" | "comfortable"

export type ResumeAccent = "blue" | "ink"

export type ResumeSkin = {
  accent: ResumeAccent
  density: ResumeDensity
  dark: boolean
  metrics: import("./resume-metrics").ResumeMetrics
}