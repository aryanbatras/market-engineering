import type { ResumeCompiler } from "@application/resume/ports/resume-compiler"
import { composePdf, estimatePageCount } from "@application/resume/pdf/compose-pdf"

export const directPdfCompiler: ResumeCompiler = {
  isMocked: false,
  compile: async ({ layout, spec, skin }) => ({
    ok: true,
    pdf: composePdf(layout, spec, skin),
    pages: estimatePageCount(layout, spec, skin),
    log: "typeset directly from the layout, no engine and no download",
  }),
}