import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { buildResumeLayout } from "./build-resume-layout"
import { composeLatex } from "./latex/compose-latex"
import { projectResume } from "./project-resume"
import type { ResumeLayoutSpec, ResumeSkin } from "./resume-layout"

export type ResumeRender = {
  document: ReturnType<typeof projectResume>
  layout: ReturnType<typeof buildResumeLayout>
  spec: ResumeLayoutSpec
  tex: string
}

export const renderResume = (
  portfolio: Portfolio,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): ResumeRender => {
  const document = projectResume(portfolio)
  const layout = buildResumeLayout(portfolio, document, spec)
  return { document, layout, spec, tex: composeLatex(layout, spec, skin) }
}