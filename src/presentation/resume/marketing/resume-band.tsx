import Link from "next/link"
import { defaultResumeSkin } from "@application/resume/resume-registry"
import { sampleAtsReport, sampleResumeLayout } from "@application/resume/sample/report"
import { Button } from "@presentation/core/design/button"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { resumeBandStyles } from "./resume-band.styles"

const rendered = sampleResumeLayout()

export const ResumeBandSection = () => (
  <section className={resumeBandStyles.root}>
    <div className={resumeBandStyles.inner}>
      <div className={resumeBandStyles.copy}>
        <h2 className={resumeBandStyles.title}>And you never typed it twice</h2>
        <p className={resumeBandStyles.lead}>
          The same data typesets as a document. Ten layouts, the ten that Indian engineers already
          use, in real LaTeX you can open in Overleaf and change yourself.
        </p>
        <Link href="/resume/templates">
          <Button intent="primary">See the resume templates</Button>
        </Link>
      </div>

      <div className={resumeBandStyles.sheetWrap}>
        <DocumentSheet layout={rendered.layout} skin={defaultResumeSkin} spec={rendered.spec} />
      </div>
    </div>
  </section>
)