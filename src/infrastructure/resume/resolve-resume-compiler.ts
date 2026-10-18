import type { ResumeCompiler } from "@application/resume/ports/resume-compiler"
import { isMockEnvironment } from "@application/core/site/app-environment"
import { mockResumeCompiler } from "../mock/resume/mock-resume-compiler"

const resolve = (): ResumeCompiler => {
  if (isMockEnvironment()) return mockResumeCompiler
  return mockResumeCompiler
}

export const resumeCompiler = resolve()