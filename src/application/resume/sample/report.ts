import { runAtsCheck } from "../ats/run-ats-check"
import { defaultResumeLayout, defaultResumeSkin } from "../resume-registry"
import { renderResume } from "../render-resume"
import { sampleExtract } from "./extract-text"
import { sampleDocument } from "./sample-portfolio"
import type { AtsReport } from "../ats/ats-report"

const sample = sampleDocument()

export const sampleAtsReport = (): AtsReport => {
  const { document } = renderResume(sample, defaultResumeLayout, defaultResumeSkin)
  return runAtsCheck(document, sampleExtract, defaultResumeLayout)
}

export const sampleResumeLayout = () =>
  renderResume(sample, defaultResumeLayout, defaultResumeSkin)