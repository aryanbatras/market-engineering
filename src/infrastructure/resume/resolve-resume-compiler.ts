import type { ResumeCompiler } from "@application/resume/ports/resume-compiler"
import { isMockEnvironment } from "@application/site/app-environment"
import { mockResumeCompiler } from "../mock/mock-resume-compiler"

const resolve = (): ResumeCompiler => {
  if (isMockEnvironment()) return mockResumeCompiler
  return mockResumeCompiler
}

export const resumeCompiler = resolve()