import type { ResumeCompiler } from "@application/resume/ports/resume-compiler"
import { isMockEnvironment } from "@application/core/site/app-environment"
import { mockResumeCompiler } from "@infrastructure/mock/resume/mock-resume-compiler"
import { directPdfCompiler } from "./direct-pdf-compiler"

const resolve = (): ResumeCompiler => {
  if (isMockEnvironment()) return mockResumeCompiler
  return directPdfCompiler
}

export const resumeCompiler = resolve()