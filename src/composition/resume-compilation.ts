import type { Portfolio } from "@application/portfolio/portfolio.schema"
import type { AtsReport } from "@application/resume/ats/ats-report"
import type { ResumeLayoutSpec, ResumeSkin } from "@application/resume/resume-layout"
import { checkResume } from "@application/resume/check-resume"
import { renderResume } from "@application/resume/render-resume"
import { pdfTextExtractor } from "@infrastructure/resume/resolve-pdf-text-extractor"
import { resumeCompiler } from "@infrastructure/resume/resolve-resume-compiler"

const compileBudgetMs = 60000

export const compileResume = async (
  portfolio: Portfolio,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): Promise<{ tex: string; report: AtsReport; pdf: Uint8Array; pages: number }> => {
  const render = renderResume(portfolio, spec, skin)
  const compiled = await resumeCompiler.compile(
    { layout: render.layout, spec, skin },
    { timeoutMs: compileBudgetMs },
  )
  const pdf = compiled.ok ? compiled.pdf : new Uint8Array()
  const report = await checkResume(portfolio, spec, skin, pdfTextExtractor, pdf)
  return { tex: render.tex, report, pdf, pages: compiled.ok ? compiled.pages : render.pages }
}