import type { ResumeLayoutSpec } from "./resume-layout"
import {
  altacv,
  awesomeCv,
  deedy,
  friggeri,
  iitBombay,
  jakesResume,
  mcdowell,
  moderncv,
  rover,
  simpleResume,
} from "./resume-layouts"

export const resumeLayoutSpecs: ResumeLayoutSpec[] = [
  jakesResume,
  deedy,
  mcdowell,
  awesomeCv,
  rover,
  simpleResume,
  moderncv,
  iitBombay,
  altacv,
  friggeri,
]

export const resumeLayoutIds = resumeLayoutSpecs.map((spec) => spec.id)

export const findResumeLayout = (id: string): ResumeLayoutSpec | null =>
  resumeLayoutSpecs.find((spec) => spec.id === id) ?? null

export const defaultResumeLayout = jakesResume

export const defaultResumeSkin = {
  accent: "blue",
  density: "comfortable",
  dark: false,
  metrics: { fontScale: "medium", sectionGap: "normal", margin: "normal" },
} as const