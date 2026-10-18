import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { formatResumeRange } from "./format-resume-date"
import type { ResumeDocument, ResumeEntry, ResumeSection } from "./resume.schema"

const internshipSectionId = "internships"

const contactLine = (portfolio: Portfolio): string[] => {
  const identity = portfolio.identity
  const items: string[] = []
  if (identity.email) items.push(identity.email)
  if (identity.phone) items.push(identity.phone)
  if (identity.location) items.push(identity.location)
  for (const link of portfolio.links) {
    const label = link.label ?? link.platform
    items.push(`${label}: ${link.url}`)
  }
  if (identity.availability) items.push(identity.availability)
  return items
}

const experienceEntries = (portfolio: Portfolio): ResumeEntry[] =>
  portfolio.experience
    .filter((item) => item.kind !== "internship")
    .map((item) => ({
      title: item.role ?? item.organisation,
      organisation: item.role ? item.organisation : "",
      dates: formatResumeRange(item.start, item.end, item.current),
      meta: item.location ?? "",
      summary: item.summary ?? "",
      bullets: item.highlights,
    }))

const internshipEntries = (portfolio: Portfolio): ResumeEntry[] =>
  portfolio.experience
    .filter((item) => item.kind === "internship")
    .map((item) => ({
      title: item.role ?? item.organisation,
      organisation: item.role ? item.organisation : "",
      dates: formatResumeRange(item.start, item.end, item.current),
      meta: item.location ?? "",
      summary: item.summary ?? "",
      bullets: item.highlights,
    }))

const educationEntries = (portfolio: Portfolio): ResumeEntry[] =>
  portfolio.education.map((item) => {
    const degree = [item.degree, item.field].filter(Boolean).join(", ")
    const score = item.score ?? item.grade
    return {
      title: degree.length > 0 ? degree : item.institution,
      organisation: degree.length > 0 ? item.institution : "",
      dates: formatResumeRange(item.start, item.end, item.current),
      meta: [item.board, score].filter(Boolean).join(" · "),
      summary: item.details ?? "",
      bullets: [],
    }
  })

const projectEntries = (portfolio: Portfolio): ResumeEntry[] =>
  portfolio.projects.map((project) => ({
    title: project.name,
    organisation: "",
    dates: project.timeline ?? "",
    meta: project.role ?? "",
    summary: project.description ?? "",
    bullets: project.tech,
  }))

const groupSkills = (portfolio: Portfolio): { label: string; items: string[] }[] => {
  const groups = new Map<string, string[]>()
  for (const skill of portfolio.skills) {
    const label = skill.group ?? "Skills"
    const bucket = groups.get(label)
    if (bucket) bucket.push(skill.name)
    else groups.set(label, [skill.name])
  }
  return [...groups.entries()].map(([label, items]) => ({ label, items }))
}

const languageEntries = (portfolio: Portfolio): ResumeEntry[] =>
  portfolio.languages.map((language) => ({
    title: language.name,
    organisation: "",
    dates: "",
    meta: language.proficiency ?? "",
    summary: "",
    bullets: [],
  }))

const highlightEntries = (portfolio: Portfolio): ResumeEntry[] =>
  portfolio.highlights.map((line) => ({
    title: line,
    organisation: "",
    dates: "",
    meta: "",
    summary: "",
    bullets: [],
  }))

const section = (
  id: string,
  title: string,
  kind: ResumeSection["kind"],
  entries: ResumeEntry[],
): ResumeSection => ({ id, title, kind, entries })

const sections = (portfolio: Portfolio): ResumeSection[] =>
  [
    section(internshipSectionId, "Internships", "experience", internshipEntries(portfolio)),
    section("experience", "Experience", "experience", experienceEntries(portfolio)),
    section("education", "Education", "education", educationEntries(portfolio)),
    section("projects", "Projects", "projects", projectEntries(portfolio)),
    section("skills", "Skills", "skills", []),
    section("languages", "Languages", "languages", languageEntries(portfolio)),
    section("highlights", "Achievements", "highlights", highlightEntries(portfolio)),
  ].filter((entry) => entry.entries.length > 0 || entry.kind === "skills")

export const projectResume = (portfolio: Portfolio): ResumeDocument => ({
  name: portfolio.identity.name,
  headline: portfolio.identity.headline ?? "",
  contact: contactLine(portfolio),
  summary: portfolio.identity.availability ?? "",
  sections: sections(portfolio),
})

export const resumeSkillGroups = groupSkills