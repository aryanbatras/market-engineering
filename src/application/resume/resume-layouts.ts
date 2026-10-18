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
  highlightsTitle: "Achievements",
  headlineFirst: true,
}

const standardOrder: ResumeLayoutSpec["order"] = [
  "experience",
  "projects",
  "education",
  "skills",
  "highlights",
]

export const jakesResume: ResumeLayoutSpec = {
  ...base,
  id: "jakes-resume",
  name: "Jake's Resume",
  forWhom: "The one almost every engineer has seen. One column, ruled sections, nothing clever.",
  summary:
    "The most-used LaTeX resume on the internet. Bold name, a ruled line under every section, one column. It parses cleanly because there is nothing to misread.",
  order: standardOrder,
  ruledHeadings: true,
}

export const deedy: ResumeLayoutSpec = {
  ...base,
  id: "deedy",
  name: "Deedy CV",
  forWhom: "When you have more than fits on one page and refuse to cut anything.",
  summary:
    "Compact single column at 9.5pt with tight leading. Denser than Jake's and about as safe to parse.",
  order: standardOrder,
  ruledHeadings: true,
  experienceTitle: "Experience",
}

export const awesomeCv: ResumeLayoutSpec = {
  ...base,
  id: "awesome-cv",
  name: "Awesome CV",
  forWhom: "When you want it to read as designed rather than printed.",
  summary:
    "One column with a filled bar behind every section heading. The accent colour does the work.",
  order: standardOrder,
  ruledHeadings: false,
}

export const altacv: ResumeLayoutSpec = {
  ...base,
  id: "altacv",
  name: "AltaCV",
  forWhom: "The best-looking of the ten. Read the parser warning before you pick it.",
  summary:
    "Two columns with a tinted sidebar for contact, skills and education. A parser reads one column before the other, so the sections come out reordered.",
  columns: 2,
  atsClean: false,
  rail: ["skills", "education"],
  order: standardOrder,
}

export const moderncv: ResumeLayoutSpec = {
  ...base,
  id: "moderncv",
  name: "ModernCV",
  forWhom: "Applying somewhere academic, or anywhere expecting a CV rather than a resume.",
  summary:
    "ModernCV's proportions. A wide measure and a heavy name, closer to a European academic CV.",
  order: ["education", "experience", "projects", "skills", "highlights"],
  headlineFirst: false,
}

export const rover: ResumeLayoutSpec = {
  ...base,
  id: "rover",
  name: "Rover",
  forWhom: "When you want the section headings to be the first thing a parser finds.",
  summary:
    "Headings tuned for detection, on a tab-aligned baseline. Deliberately boring, and that is the point.",
  order: standardOrder,
  ruledHeadings: true,
  experienceTitle: "Work experience",
  educationTitle: "Education and training",
}

export const mcdowell: ResumeLayoutSpec = {
  ...base,
  id: "mcdowell",
  name: "McDowell",
  forWhom: "When the header block should carry your name, role and contact before anything else.",
  summary:
    "A strong header band above a plain single column. The shape most people picture when they picture a CV.",
  order: standardOrder,
  ruledHeadings: false,
}

export const friggeri: ResumeLayoutSpec = {
  ...base,
  id: "friggeri",
  name: "Friggeri",
  forWhom: "A long project list that needs a rail. Reads beautifully, parses out of order.",
  summary:
    "Two columns, dense, with everything secondary pushed into a narrow rail. The other layout people mistake for ATS-safe.",
  columns: 2,
  atsClean: false,
  rail: ["skills", "highlights"],
  order: standardOrder,
}

export const simpleResume: ResumeLayoutSpec = {
  ...base,
  id: "simple",
  name: "Simple Resume",
  forWhom: "When you want the opposite of a design decision.",
  summary:
    "No rules, no colour, no band. Section names in bold, everything else plain text, maximum room for the work.",
  order: standardOrder,
  ruledHeadings: false,
  headlineFirst: false,
}

export const iitBombay: ResumeLayoutSpec = {
  ...base,
  id: "iit-bombay",
  name: "IIT Bombay",
  forWhom: "The one-pager an IIT or NIT recruiter has already read four hundred times.",
  summary:
    "Board, score and degree as a block at the top, then work. The most recognised resume shape in India.",
  order: ["education", "experience", "projects", "skills", "highlights"],
  educationTitle: "Education",
  highlightsTitle: "Achievements",
}