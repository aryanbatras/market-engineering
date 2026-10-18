import type { PdfTextExtractor } from "@application/resume/ports/pdf-text-extractor"
import { isMockEnvironment } from "@application/core/site/app-environment"
import { mockPdfTextExtractor } from "@infrastructure/mock/resume/mock-pdf-text-extractor"
import { unpdfTextExtractor } from "./unpdf-text-extractor"

const resolve = (): PdfTextExtractor => {
  if (isMockEnvironment()) return mockPdfTextExtractor
  return unpdfTextExtractor
}

export const pdfTextExtractor = resolve()