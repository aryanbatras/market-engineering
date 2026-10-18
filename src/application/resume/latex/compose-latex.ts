import type { ResumeLayout, ResumeLayoutSpec, ResumeSkin } from "../resume-layout"
import { atsPreamble } from "./ats-preamble"
import { emitBlock } from "./emit-block"
import { resumeMacros } from "./resume-macros"

const pageGeometry = (spec: ResumeLayoutSpec, skin: ResumeSkin): string => {
  const margin = skin.density === "compact" ? "1.5cm" : "1.9cm"
  const tight = spec.id === "compact" || spec.id === "rail"
  const size = tight ? "\\fontsize{9.5}{11.2}\\selectfont" : "\\fontsize{10}{12.4}\\selectfont"
  return [`\\usepackage[a4paper,margin=${margin}]{geometry}`, "\\setlength{\\emergencystretch}{3em}", size].join("\n")
}

const colourPackage = (spec: ResumeLayoutSpec, skin: ResumeSkin): string => {
  if (spec.id !== "colour" && spec.id !== "atlas" && spec.id !== "campus") return ""
  const hex = skin.accent === "blue" ? "0A66C2" : "0A0A0B"
  return [`\\usepackage{xcolor}`, `\\definecolor{resumeaccent}{HTML}{${hex}}`].join("\n")
}

const sectionMacro = (spec: ResumeLayoutSpec): string =>
  spec.id === "colour"
    ? `\\renewcommand{\\rsection}[1]{\\vspace{2.6ex}\\colorbox{resumeaccent}{\\parbox{\\dimexpr\\linewidth-2\\fboxsep\\relax}{\\color{white}\\bfseries #1}}}\\vspace{1.2ex}}`
    : spec.id === "header"
      ? `\\renewcommand{\\rname}[1]{\\vspace{1.4ex}{\\colorbox{resumeaccent}{\\parbox{\\dimexpr\\linewidth-2\\fboxsep\\relax}{\\color{white}\\fontsize{20}{23}\\selectfont\\bfseries #1}}}\\par}`
      : ""

const documentClass = (spec: ResumeLayoutSpec): string =>
  spec.id === "campus" ? "\\documentclass[11pt,a4paper]{article}" : "\\documentclass[10pt,a4paper]{article}"

export const composeLatex = (
  layout: ResumeLayout,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): string => {
  const body = layout.blocks
    .map((block) => emitBlock(block))
    .filter((line): line is string => line !== null)
    .join("\n")

  return [
    documentClass(spec),
    atsPreamble,
    pageGeometry(spec, skin),
    colourPackage(spec, skin),
    resumeMacros,
    sectionMacro(spec),
    "",
    "\\begin{document}",
    "\\rdocsetup",
    body,
    "\\end{document}",
    "",
  ]
    .filter((line) => line.length > 0)
    .join("\n")
}