import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import type { ParseResult } from "@application/portfolio/parse-portfolio"
import { sampleDocumentYaml } from "./document-yaml"

export const resumeParseResult = (text: string): ParseResult => parsePortfolioText(text)

export const initialResumeYaml = sampleDocumentYaml
