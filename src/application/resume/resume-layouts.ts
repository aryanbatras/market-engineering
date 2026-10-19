import type { ResumeLayoutSpec } from "./resume-layout"

type ResumeLayoutBase = Omit<ResumeLayoutSpec, "id" | "name" | "forWhom" | "summary" | "order">

const base: ResumeLayoutBase = {
  columns: 1,
  atsClean: true,
  dialect: "pdftex",
  rail: [],
  summaryBlock: false,
  experienceTitle: "Experience",
  educationTitle: "Education",
  projectsTitle: "Projects",
  skillsTitle: "Skills",
  highlightsTitle: "Achievements",
  headlineFirst: true,
  nameStyle: "left",
  headerAlign: "left",
  headlineStyle: "italic",
  contactSeparator: "dot",
  headingCaps: false,
  headingStyle: "plain",
  headerRule: false,
  entryStyle: "split",
  bulletStyle: "dash",
  railTint: false,
  railWidth: 0.28,
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
    "The most-used LaTeX resume on the internet. A heavy name, a ruled line under every section, no bullet marks at all. It parses cleanly because there is nothing to misread.",
  order: standardOrder,
  nameStyle: "left",
  headerAlign: "centred",
  headlineStyle: "bold",
  contactSeparator: "bar",
  headingCaps: true,
  headingStyle: "rule",
  entryStyle: "split",
  bulletStyle: "none",
}

export const deedy: ResumeLayoutSpec = {
  ...base,
  id: "deedy",
  name: "Deedy CV",
  forWhom: "When you have more than fits on one page and refuse to cut anything.",
  summary:
    "Compact at 9.5pt with tight leading. Role, employer and dates all on one line, because a line is the unit a one-page CV runs out of.",
  order: standardOrder,
  headingStyle: "rule",
  entryStyle: "inline",
  bulletStyle: "dash",
}

export const awesomeCv: ResumeLayoutSpec = {
  ...base,
  id: "awesome-cv",
  name: "Awesome CV",
  forWhom: "When you want it to read as designed rather than printed.",
  summary:
    "One column with a filled bar behind every section heading. The accent colour does all the work, and there is nowhere for it to hide.",
  order: standardOrder,
  headingStyle: "bar",
  entryStyle: "split",
  bulletStyle: "dash",
}

export const altacv: ResumeLayoutSpec = {
  ...base,
  id: "altacv",
  name: "AltaCV",
  forWhom: "The best-looking of the ten. Read the parser warning before you pick it.",
  summary:
    "A boxed name across the top, then a tinted sidebar for contact, skills and education. A parser reads one column before the other, so the sections come out reordered.",
  columns: 2,
  atsClean: false,
  rail: ["skills", "education"],
  order: standardOrder,
  nameStyle: "boxed",
  headingStyle: "plain",
  entryStyle: "split",
  bulletStyle: "dash",
  railTint: true,
  railWidth: 0.3,
}

export const moderncv: ResumeLayoutSpec = {
  ...base,
  id: "moderncv",
  name: "ModernCV",
  forWhom: "Applying somewhere academic, or anywhere expecting a CV rather than a resume.",
  summary:
    "ModernCV's proportions. A wide measure, a heavy name and a rule under the header, closer to a European academic CV than to an American one.",
  order: ["education", "experience", "projects", "skills", "highlights"],
  headlineFirst: false,
  nameStyle: "left",
  headingStyle: "rule",
  headerRule: true,
  entryStyle: "split",
  bulletStyle: "none",
}

export const rover: ResumeLayoutSpec = {
  ...base,
  id: "rover",
  name: "Rover",
  forWhom: "When you want the section headings to be the first thing a parser finds.",
  summary:
    "A small square in front of every heading, on a tab-aligned baseline. Deliberately boring, and that is the point.",
  order: standardOrder,
  headingCaps: true,
  headingStyle: "caret",
  entryStyle: "split",
  bulletStyle: "dot",
  experienceTitle: "Work experience",
  educationTitle: "Education and training",
}

export const mcdowell: ResumeLayoutSpec = {
  ...base,
  id: "mcdowell",
  name: "McDowell",
  forWhom: "When the header block should carry your name, role and contact before anything else.",
  summary:
    "A centred name, centred contact, and one full-width rule under the whole header. The shape most people picture when they picture a CV.",
  order: standardOrder,
  nameStyle: "centred",
  headerAlign: "centred",
  headlineStyle: "bold",
  contactSeparator: "bar",
  headingCaps: true,
  headingStyle: "rule",
  headerRule: true,
  entryStyle: "split",
  bulletStyle: "dash",
}

export const friggeri: ResumeLayoutSpec = {
  ...base,
  id: "friggeri",
  name: "Friggeri",
  forWhom: "A long project list that needs a rail. Reads beautifully, parses out of order.",
  summary:
    "Two columns at 9pt with everything secondary pushed into a narrow rail and no tint. The other layout people mistake for ATS-safe.",
  columns: 2,
  atsClean: false,
  rail: ["skills", "highlights"],
  order: standardOrder,
  headingStyle: "rule",
  entryStyle: "inline",
  bulletStyle: "dot",
  railWidth: 0.24,
}

export const simpleResume: ResumeLayoutSpec = {
  ...base,
  id: "simple",
  name: "Simple Resume",
  forWhom: "When you want the opposite of a design decision.",
  summary:
    "No rules, no colour, no band. Section names in bold, everything else plain text, maximum room for the work.",
  order: standardOrder,
  headlineFirst: false,
  nameStyle: "left",
  headerAlign: "left",
  headlineStyle: "italic",
  contactSeparator: "dot",
  headingCaps: false,
  headingStyle: "plain",
  entryStyle: "split",
  bulletStyle: "dash",
}

export const iitBombay: ResumeLayoutSpec = {
  ...base,
  id: "iit-bombay",
  name: "IIT Bombay",
  forWhom: "The one-pager an IIT or NIT recruiter has already read four hundred times.",
  summary:
    "Name centred, then board, score and degree as a block at the top, then work. The most recognised resume shape in India, set larger than everything else.",
  order: ["education", "experience", "projects", "skills", "highlights"],
  headlineFirst: false,
  nameStyle: "centred",
  headerAlign: "centred",
  headlineStyle: "bold",
  contactSeparator: "bar",
  headingCaps: true,
  headingStyle: "plain",
  entryStyle: "split",
  bulletStyle: "none",
}