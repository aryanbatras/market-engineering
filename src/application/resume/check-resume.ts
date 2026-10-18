import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { renderResume } from "./render-resume"
import { runAtsCheck } from "./ats/run-ats-check"
import type { AtsReport } from "./ats/ats-report"
import type { PdfTextExtractor } from "./ports/pdf-text-extractor"
import type { ResumeLayoutSpec, ResumeSkin } from "./resume-layout"

export const checkResume = async (
  portfolio: Portfolio,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
  extractor: PdfTextExtractor,
  pdf: Uint8Array<ArrayBuffer>,
): Promise<AtsReport> => {
  const { document } = renderResume(portfolio, spec, skin)
  const text = await extractor.extractText(pdf)
  return runAtsCheck(document, text, spec)
}