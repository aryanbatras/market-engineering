import Link from "next/link"
import { LuArrowRight } from "react-icons/lu"
import { resumeLayoutSpecs, defaultResumeSkin } from "@application/resume/resume-registry"
import { renderResume } from "@application/resume/render-resume"
import { sampleDocument } from "@application/resume/sample/sample-portfolio"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { resumeShelfStyles } from "./resume-shelf.styles"

const sample = sampleDocument()

const cards = resumeLayoutSpecs.map((spec) => ({
  spec,
  layout: renderResume(sample, spec, defaultResumeSkin).layout,
}))

const noteOf = (columns: number, heading: string): string => {
  if (columns === 2) return "Two columns"
  if (heading === "rule") return "Ruled sections"
  if (heading === "bar") return "Filled headings"
  return "One column"
}

export const ResumeTemplateShelf = () => (
  <div className={resumeShelfStyles.root}>
    <div className={resumeShelfStyles.head}>
      <div className={resumeShelfStyles.copy}>
        <h2 className={resumeShelfStyles.title}>Resume templates</h2>
        <p className={resumeShelfStyles.lead}>
          Not ten layouts we invented. These are the ten names an Indian engineering student has
          already seen on GitHub, typeset by us and safe to hand in.
        </p>
      </div>
      <Link className={resumeShelfStyles.all} href="/resume/templates">
        Open the gallery
        <LuArrowRight size={15} strokeWidth={1.5} />
      </Link>
    </div>

    <div className={resumeShelfStyles.grid}>
      {cards.map((card) => (
        <Link className={resumeShelfStyles.item} href={`/resume?layout=${card.spec.id}`} key={card.spec.id}>
          <div className={resumeShelfStyles.frame}>
            <div className={resumeShelfStyles.canvas}>
              <DocumentSheet layout={card.layout} skin={defaultResumeSkin} spec={card.spec} />
            </div>
          </div>
          <div className={resumeShelfStyles.foot}>
            <span className={resumeShelfStyles.name}>{card.spec.name}</span>
            <span className={resumeShelfStyles.note}>
              {noteOf(card.spec.columns, card.spec.headingStyle)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
)