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
  compile: (tex: string, options: CompileOptions) => Promise<CompileResult>
  isMocked: boolean
}