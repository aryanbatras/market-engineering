import type { ResumeLayoutSpec } from "./resume-layout"
import {
  atlas,
  campus,
  colour,
  compact,
  engineer,
  header,
  modern,
  rail,
  rule,
  sidebar,
} from "./resume-layouts"

export const resumeLayoutSpecs: ResumeLayoutSpec[] = [
  rule,
  compact,
  header,
  colour,
  engineer,
  atlas,
  campus,
  sidebar,
  rail,
  modern,
]

export const resumeLayoutIds = resumeLayoutSpecs.map((spec) => spec.id)

export const findResumeLayout = (id: string): ResumeLayoutSpec | null =>
  resumeLayoutSpecs.find((spec) => spec.id === id) ?? null

export const defaultResumeLayout = rule

export const defaultResumeSkin = { accent: "blue", density: "comfortable", dark: false } as const