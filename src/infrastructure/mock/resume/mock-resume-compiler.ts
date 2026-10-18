import type { CompileOptions, CompileResult, ResumeCompiler } from "@application/resume/ports/resume-compiler"
import { composePdf, estimatePageCount } from "@application/resume/pdf/compose-pdf"

export const mockResumeCompiler: ResumeCompiler = {
  isMocked: true,
  compile: async ({ layout, spec, skin }, options: CompileOptions): Promise<CompileResult> => ({
    ok: true,
    pdf: composePdf(layout, spec, skin),
    pages: estimatePageCount(layout, spec, skin),
    log: `mock engine · direct typesetting, no download · ${options.timeoutMs}ms budget`,
  }),
}