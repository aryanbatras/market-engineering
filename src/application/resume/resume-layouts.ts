import type { ResumeLayoutSpec } from "./resume-layout"

type ResumeLayoutBase = Omit<ResumeLayoutSpec, "id" | "name" | "forWhom" | "summary" | "order">

const base: ResumeLayoutBase = {
  columns: 1,
  atsClean: true,
  dialect: "pdftex",
  rail: [],
  ruledHeadings: false,
  summaryBlock: false,
  experienceTitle: "Experience",
  educationTitle: "Education",
  projectsTitle: "Projects",
  skillsTitle: "Skills",
  languagesTitle: "Languages",
  highlightsTitle: "Achievements",
  headlineFirst: true,
}

export const rule: ResumeLayoutSpec = {
  ...base,
  id: "rule",
  name: "Rule",
  forWhom: "The safe choice, and the one a recruiter's software reads most cleanly.",
  summary: "One column. Section headings with a rule under them. Nothing to misread.",
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
  ruledHeadings: true,
}

export const compact: ResumeLayoutSpec = {
  ...base,
  id: "compact",
  name: "Compact",
  forWhom: "When everything you have is worth showing and it has to fit one page.",
  summary: "One column at 9.5pt. Denser leading and margins so more survives.",
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
  ruledHeadings: false,
}

export const header: ResumeLayoutSpec = {
  ...base,
  id: "header",
  name: "Header",
  forWhom: "When your name and target role are the first thing that should land.",
  summary: "A filled header band holding the name. Everything below it stays plain.",
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
}

export const colour: ResumeLayoutSpec = {
  ...base,
  id: "colour",
  name: "Colour",
  forWhom: "When you want it to read as designed rather than printed.",
  summary: "One column with section headings as filled bars. The accent does the work.",
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
}

export const engineer: ResumeLayoutSpec = {
  ...base,
  id: "engineer",
  name: "Engineer",
  forWhom: "When the work should be the whole page.",
  summary: "No contact banner, no flourish. A name, then straight into what you built.",
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
  headlineFirst: false,
}

export const atlas: ResumeLayoutSpec = {
  ...base,
  id: "atlas",
  name: "Atlas",
  forWhom: "When you want section headings a parser finds before anything else.",
  summary: "Deliberately boring headings on a tab-aligned baseline. Built to be scanned.",
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
  ruledHeadings: true,
  experienceTitle: "Work experience",
  educationTitle: "Education and training",
}

export const campus: ResumeLayoutSpec = {
  ...base,
  id: "campus",
  name: "Campus",
  forWhom: "The one-pager an IIT or NIT recruiter has already read four hundred of.",
  summary: "Board, score and degree as a block up top. The familiar shape, done properly.",
  order: ["education", "experience", "projects", "skills", "highlights", "languages"],
  educationTitle: "Education",
  highlightsTitle: "Achievements",
}

export const sidebar: ResumeLayoutSpec = {
  ...base,
  id: "sidebar",
  name: "Sidebar",
  forWhom: "When you want the two-column look and will read the warning first.",
  summary: "A tinted rail for skills and contact. Looks the most designed of the ten.",
  columns: 2,
  atsClean: false,
  rail: ["skills", "languages", "education"],
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
}

export const rail: ResumeLayoutSpec = {
  ...base,
  id: "rail",
  name: "Rail",
  forWhom: "A narrow rail and a heavy column, for a long project list.",
  summary: "Everything secondary in a 24% rail. Denser still, at 9pt.",
  columns: 2,
  atsClean: false,
  rail: ["skills", "languages", "highlights"],
  order: ["experience", "projects", "education", "skills", "highlights", "languages"],
}

export const modern: ResumeLayoutSpec = {
  ...base,
  id: "modern",
  name: "Modern",
  forWhom: "Applying somewhere with an academic or research feel.",
  summary: "A wide measure and a heavy name. The proportions people expect from a CV.",
  order: ["education", "experience", "projects", "skills", "highlights", "languages"],
  experienceTitle: "Experience",
  educationTitle: "Education",
}