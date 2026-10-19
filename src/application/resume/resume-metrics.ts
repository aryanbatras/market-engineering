export type ResumeMetrics = {
  bodySize: number
  nameSize: number
  sectionGap: number
  entryGap: number
  pageMargin: number
  headingRule: boolean
  bulletStyle: "none" | "dash" | "dot"
}

export const defaultResumeMetrics: ResumeMetrics = {
  bodySize: 10,
  nameSize: 21,
  sectionGap: 2.6,
  entryGap: 1.2,
  pageMargin: 1.9,
  headingRule: true,
  bulletStyle: "dash",
}

export type ResumeMetricField = keyof ResumeMetrics

export type ResumeMetricRange = {
  field: ResumeMetricField
  label: string
  min: number
  max: number
  step: number
  unit: string
}

export const resumeMetricRanges: ResumeMetricRange[] = [
  { field: "bodySize", label: "Body size", min: 7, max: 14, step: 0.5, unit: "pt" },
  { field: "nameSize", label: "Name size", min: 12, max: 40, step: 1, unit: "pt" },
  { field: "sectionGap", label: "Section gap", min: 0, max: 8, step: 0.2, unit: "ex" },
  { field: "entryGap", label: "Entry gap", min: 0, max: 6, step: 0.2, unit: "ex" },
  { field: "pageMargin", label: "Page margin", min: 0.4, max: 4, step: 0.1, unit: "cm" },
]