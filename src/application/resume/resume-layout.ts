import type { ResumeSectionKind } from "./resume.schema"

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
  rule: boolean
}

export type ResumeEntryBlock = {
  kind: "entry"
  title: string
  organisation: string
  dates: string
  meta: string
  summary: string
  bullets: string[]
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
  ruledHeadings: boolean
  summaryBlock: boolean
  experienceTitle: string
  educationTitle: string
  projectsTitle: string
  skillsTitle: string
  languagesTitle: string
  highlightsTitle: string
  headlineFirst: boolean
}

export type ResumeDensity = "compact" | "comfortable"

export type ResumeAccent = "blue" | "ink"

export type ResumeSkin = {
  accent: ResumeAccent
  density: ResumeDensity
  dark: boolean
}