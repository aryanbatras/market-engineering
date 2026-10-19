import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { resumeSkillGroups } from "./project-resume"
import type { ResumeDocument, ResumeSection, ResumeSectionKind } from "./resume.schema"
import type { ResumeBlock, ResumeLayout, ResumeLayoutSpec } from "./resume-layout"

const internshipSectionId = "internships"

const sectionTitle = (spec: ResumeLayoutSpec, kind: ResumeSectionKind): string => {
  switch (kind) {
    case "experience":
      return spec.experienceTitle
    case "education":
      return spec.educationTitle
    case "projects":
      return spec.projectsTitle
    case "skills":
      return spec.skillsTitle
    case "highlights":
      return spec.highlightsTitle
  }
}

const findSection = (document: ResumeDocument, id: string): ResumeSection | null =>
  document.sections.find((entry) => entry.id === id) ?? null

const heading = (spec: ResumeLayoutSpec, text: string): ResumeBlock => ({
  kind: "heading",
  text,
  style: spec.headingStyle,
})

const entriesToBlocks = (
  entries: ResumeSection["entries"],
  spec: ResumeLayoutSpec,
): ResumeBlock[] =>
  entries.map<ResumeBlock>((entry) => ({
    kind: "entry",
    title: entry.title,
    organisation: entry.organisation,
    dates: entry.dates,
    meta: entry.meta,
    summary: entry.summary,
    bullets: entry.bullets,
    style: spec.entryStyle,
  }))

const sectionBlocks = (
  document: ResumeDocument,
  spec: ResumeLayoutSpec,
  id: string,
  title: string,
): ResumeBlock[] => {
  const source = findSection(document, id)
  if (source === null || source.entries.length === 0) return []
  return [heading(spec, title), ...entriesToBlocks(source.entries, spec)]
}

const kindBlocks = (
  document: ResumeDocument,
  spec: ResumeLayoutSpec,
  kind: ResumeSectionKind,
): ResumeBlock[] => sectionBlocks(document, spec, kind, sectionTitle(spec, kind))

const skillsBlocks = (portfolio: Portfolio, spec: ResumeLayoutSpec): ResumeBlock[] => {
  const groups = resumeSkillGroups(portfolio).filter((group) => group.items.length > 0)
  if (groups.length === 0) return []
  const normalised = groups.map((group) => ({
    label: group.label === "Skills" ? "" : group.label,
    items: group.items,
  }))
  return [heading(spec, spec.skillsTitle), { kind: "skills", groups: normalised }]
}

const experienceBlocks = (document: ResumeDocument, spec: ResumeLayoutSpec): ResumeBlock[] => [
  ...sectionBlocks(document, spec, internshipSectionId, "Internships"),
  ...kindBlocks(document, spec, "experience"),
]

export const buildResumeLayout = (
  portfolio: Portfolio,
  document: ResumeDocument,
  spec: ResumeLayoutSpec,
): ResumeLayout => {
  const blocks: ResumeBlock[] = [{ kind: "name", text: document.name }]
  const railIndexes: number[] = []
  const push = (kind: ResumeSectionKind, produced: ResumeBlock[]): void => {
    if (spec.rail.includes(kind)) railIndexes.push(blocks.length)
    blocks.push(...produced)
  }

  if (spec.headlineFirst && document.headline.length > 0) {
    blocks.push({ kind: "note", text: document.headline })
  }

  if (document.contact.length > 0) {
    blocks.push({ kind: "contact", items: document.contact })
  }

  if (spec.summaryBlock && document.summary.trim().length > 0) {
    blocks.push({ kind: "note", text: document.summary })
  }

  for (const kind of spec.order) {
    if (kind === "skills") push(kind, skillsBlocks(portfolio, spec))
    else if (kind === "experience") push(kind, experienceBlocks(document, spec))
    else push(kind, kindBlocks(document, spec, kind))
  }

  return { id: spec.id, blocks, railIndexes }
}