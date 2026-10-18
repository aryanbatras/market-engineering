import type { ResumeLayout, ResumeLayoutSpec, ResumeSkin } from "../resume-layout"

export type ResumePayload = {
  layout: ResumeLayout
  spec: ResumeLayoutSpec
  skin: ResumeSkin
}

export type CompileOptions = {
  timeoutMs: number
}

export type CompileSuccess = {
  ok: true
  pdf: Uint8Array<ArrayBuffer>
  pages: number
  log: string
}

export type CompileFailure = {
  ok: false
  log: string
}

export type CompileResult = CompileSuccess | CompileFailure

export type ResumeCompiler = {
  compile: (payload: ResumePayload, options: CompileOptions) => Promise<CompileResult>
  isMocked: boolean
}