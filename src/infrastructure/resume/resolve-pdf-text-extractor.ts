import type { PdfTextExtractor } from "@application/resume/ports/pdf-text-extractor"
import { isMockEnvironment } from "@application/core/site/app-environment"
import { mockPdfTextExtractor } from "../mock/resume/mock-pdf-text-extractor"

const resolve = (): PdfTextExtractor => {
  if (isMockEnvironment()) return mockPdfTextExtractor
  return mockPdfTextExtractor
}

export const pdfTextExtractor = resolve()