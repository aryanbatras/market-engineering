import Link from "next/link"
import { LuArrowRight } from "react-icons/lu"
import { resumeLayoutSpecs, defaultResumeSkin } from "@application/resume/resume-registry"
import { renderResume } from "@application/resume/render-resume"
import { sampleDocument } from "@application/resume/sample/sample-portfolio"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { resumeShelfStyles } from "./resume-shelf.styles"

const sample = sampleDocument()

const shown = resumeLayoutSpecs.slice(0, 6)

const renderings = shown.map((spec) => ({
  id: spec.id,
  spec,
  layout: renderResume(sample, spec, defaultResumeSkin).layout,
}))

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
        All ten resume templates
        <LuArrowRight size={15} strokeWidth={1.5} />
      </Link>
    </div>

    <div className={resumeShelfStyles.rail}>
      {renderings.map((entry) => (
        <Link className={resumeShelfStyles.item} href={`/resume?layout=${entry.id}`} key={entry.id}>
          <div className={resumeShelfStyles.frame}>
            <div className={resumeShelfStyles.canvas}>
              <DocumentSheet layout={entry.layout} skin={defaultResumeSkin} spec={entry.spec} />
            </div>
          </div>
          <div className={resumeShelfStyles.foot}>
            <span className={resumeShelfStyles.name}>{entry.spec.name}</span>
            <span className={resumeShelfStyles.note}>
              {entry.spec.columns === 2 ? "Two columns" : "One column"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
)