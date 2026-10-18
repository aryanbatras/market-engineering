import { renderResume } from "../src/application/resume/render-resume"
import {
  resumeLayoutSpecs,
  defaultResumeLayout,
  defaultResumeSkin,
} from "../src/application/resume/resume-registry"
import { previewPortfolio } from "../src/application/portfolio/preview-portfolio"
import { portfolioSchema } from "../src/application/portfolio/portfolio.schema"
import { writeFileSync, mkdirSync } from "node:fs"

const portfolio = portfolioSchema.parse(previewPortfolio)
mkdirSync(".resume-out", { recursive: true })

for (const spec of resumeLayoutSpecs) {
  const { tex, layout } = renderResume(portfolio, spec, defaultResumeSkin)
  writeFileSync(`.resume-out/${spec.id}.tex`, tex)
  console.log(`${spec.id.padEnd(10)} blocks=${String(layout.blocks.length).padStart(3)}  bytes=${tex.length}`)
}

console.log("\n--- rule.tex ---")
console.log(renderResume(portfolio, defaultResumeLayout, defaultResumeSkin).tex)