import type { PdfTextExtractor } from "@application/resume/ports/pdf-text-extractor"
import { extractText, getDocumentProxy } from "unpdf"

const read = async (pdf: Uint8Array): Promise<string> => {
  const document = await getDocumentProxy(new Uint8Array(pdf))
  const result = await extractText(document, { mergePages: false })
  const pages = (result as { text: string[] }).text
  return pages.join("\n")
}

export const unpdfTextExtractor: PdfTextExtractor = {
  isMocked: false,
  extractText: read,
}