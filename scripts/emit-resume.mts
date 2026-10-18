import { renderResume } from "@application/resume/render-resume"
import { resumeLayoutSpecs, defaultResumeLayout, defaultResumeSkin } from "@application/resume/resume-registry"
import { sampleDocument } from "@application/resume/sample/sample-portfolio"
import { runAtsCheck } from "@application/resume/ats/run-ats-check"
import { extractText, getDocumentProxy } from "unpdf"
import { writeFileSync, mkdirSync } from "node:fs"

const portfolio = sampleDocument()
mkdirSync(".resume-out", { recursive: true })

const readText = async (pdf: Uint8Array<ArrayBuffer>): Promise<string> => {
  const doc = await getDocumentProxy(new Uint8Array(pdf))
  const result = await extractText(doc, { mergePages: false })
  return (result as { text: string[] }).text.join("\n")
}

for (const spec of resumeLayoutSpecs) {
  const render = renderResume(portfolio, spec, defaultResumeSkin)
  const text = await readText(render.pdf)
  const report = runAtsCheck(render.document, text, spec)
  writeFileSync(`.resume-out/${spec.id}.pdf`, render.pdf)
  const chars = text.replace(/\s+/g, "").length
  console.log(
    `${spec.id.padEnd(12)} pdf=${String(render.pdf.length).padStart(5)}B  pages=${render.pages}  chars=${String(chars).padStart(4)}  ats=${report.passed ? "pass" : "FAIL"}`,
  )
}

const base = renderResume(portfolio, defaultResumeLayout, defaultResumeSkin)
const text = await readText(base.pdf)
console.log("\n--- extracted from Jake's Resume ---")
console.log(text)
const report = runAtsCheck(base.document, await readText(base.pdf), defaultResumeLayout)
console.log("\n--- ATS findings ---")
for (const f of report.findings) console.log(f.severity, f.check, "|", f.message.slice(0, 120))
