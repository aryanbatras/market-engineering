export type PdfTextExtractor = {
  extractText: (pdf: Uint8Array<ArrayBuffer>) => Promise<string>
  isMocked: boolean
}