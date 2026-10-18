import { previewPortfolio } from "@application/portfolio/preview-portfolio"
import { portfolioSchema } from "@application/portfolio/portfolio.schema"
import { runAtsCheck } from "./ats/run-ats-check"
import { defaultResumeLayout, defaultResumeSkin } from "./resume-registry"
import { renderResume } from "./render-resume"
import { sampleExtract } from "./sample-extract"
import type { AtsReport } from "./ats/ats-report"
import type { Portfolio } from "@application/portfolio/portfolio.schema"

const sample = portfolioSchema.parse(previewPortfolio)

export const sampleAtsReport = (): AtsReport => {
  const { document } = renderResume(sample, defaultResumeLayout, defaultResumeSkin)
  return runAtsCheck(document, sampleExtract, defaultResumeLayout)
}

export const sampleResumeLayout = (portfolio: Portfolio) =>
  renderResume(portfolio, defaultResumeLayout, defaultResumeSkin)