import type { PdfTextExtractor } from "@application/resume/ports/pdf-text-extractor"
import { sampleExtract } from "@application/resume/sample-extract"

export const mockPdfTextExtractor: PdfTextExtractor = {
  isMocked: true,
  extractText: async (): Promise<string> => sampleExtract,
}