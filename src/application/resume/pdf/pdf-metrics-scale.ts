import type { ResumeMetrics } from "../resume-layout"

export const fontSizes: Record<ResumeMetrics["fontScale"], number> = {
  small: 9,
  medium: 10,
  large: 11.5,
}

export const sectionGaps: Record<ResumeMetrics["sectionGap"], number> = {
  tight: 9,
  normal: 15,
  roomy: 23,
}

export const pageMargins: Record<ResumeMetrics["margin"], number> = {
  narrow: 32,
  normal: 48,
  wide: 68,
}

export const leading = (base: number): number => base * 1.34