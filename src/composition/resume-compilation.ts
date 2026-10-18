import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { checkResume } from "@application/resume/check-resume"
import type { AtsReport } from "@application/resume/ats/ats-report"
import type { ResumeLayoutSpec, ResumeSkin } from "@application/resume/resume-layout"
import { pdfTextExtractor } from "@infrastructure/resume/resolve-pdf-text-extractor"
import { resumeCompiler } from "@infrastructure/resume/resolve-resume-compiler"
import { renderResume } from "@application/resume/render-resume"

const compileBudgetMs = 60000

export const compileResume = async (
  portfolio: Portfolio,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): Promise<{ tex: string; report: AtsReport; pdf: Uint8Array; pages: number }> => {
  const { tex } = renderResume(portfolio, spec, skin)
  const compiled = await resumeCompiler.compile(tex, { timeoutMs: compileBudgetMs })
  const pdf = compiled.ok ? compiled.pdf : new Uint8Array()
  const report = await checkResume(portfolio, spec, skin, pdfTextExtractor, pdf)
  return { tex, report, pdf, pages: compiled.ok ? compiled.pages : 0 }
}