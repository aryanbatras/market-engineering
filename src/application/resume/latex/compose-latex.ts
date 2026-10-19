import type { ResumeBlock, ResumeLayout, ResumeLayoutSpec, ResumeSkin } from "../resume-layout"
import { atsPreamble } from "./ats-preamble"
import { emitLayout } from "./emit-block"
import { resumeMacros } from "./resume-macros"

const pageGeometry = (skin: ResumeSkin): string => {
  const margin = skin.metrics.pageMargin
  const body = skin.metrics.bodySize
  const lead = (body * 1.24).toFixed(2)
  return [
    `\\usepackage[a4paper,margin=${margin}cm]{geometry}`,
    "\\setlength{\\emergencystretch}{3em}",
    `\\fontsize{${body}}{${lead}}\\selectfont`,
  ].join("\n")
}

const usesAccent = (spec: ResumeLayoutSpec): boolean =>
  spec.headingStyle === "bar" || spec.nameStyle === "boxed" || spec.railTint

const colourPackage = (spec: ResumeLayoutSpec, skin: ResumeSkin): string => {
  if (!usesAccent(spec)) return ""
  const hex = skin.accent === "blue" ? "0A66C2" : "0A0A0B"
  return ["\\usepackage{xcolor}", `\\definecolor{resumeaccent}{HTML}{${hex}}`].join("\n")
}

const headerLength = (blocks: ResumeBlock[]): number => {
  const firstHeading = blocks.findIndex((block) => block.kind === "heading")
  return firstHeading === -1 ? blocks.length : firstHeading
}

export const composeLatex = (
  layout: ResumeLayout,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): string => {
  const head = headerLength(layout.blocks)
  const header: ResumeLayout = { id: layout.id, blocks: layout.blocks.slice(0, head), railIndexes: [] }
  const body: ResumeLayout = {
    id: layout.id,
    blocks: layout.blocks.slice(head),
    railIndexes: layout.railIndexes.filter((index) => index >= head).map((index) => index - head),
  }

  return [
    "\\documentclass[a4paper]{article}",
    atsPreamble,
    pageGeometry(skin),
    colourPackage(spec, skin),
    resumeMacros,
    "",
    "\\begin{document}",
    "\\rdocsetup",
    emitLayout(header, spec, skin.metrics),
    spec.headerRule ? `\\rheadrule{${(skin.metrics.sectionGap / 2).toFixed(2)}}` : "",
    emitLayout(body, spec, skin.metrics),
    "\\end{document}",
    "",
  ]
    .filter((line) => line.length > 0)
    .join("\n")
}