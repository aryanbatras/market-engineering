import Link from "next/link"
import { previewPortfolio } from "@application/portfolio/preview-portfolio"
import { portfolioSchema } from "@application/portfolio/portfolio.schema"
import { defaultResumeSkin } from "@application/resume/resume-registry"
import { sampleAtsReport, sampleResumeLayout } from "@application/resume/sample-ats-report"
import { Button } from "@presentation/design/button"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { ExtractedTextPane } from "@presentation/resume/components/extracted-text-pane"
import { resumeBandStyles } from "./resume-band.styles"

const portfolio = portfolioSchema.parse(previewPortfolio)
const rendered = sampleResumeLayout(portfolio)
const report = sampleAtsReport()

const ResumeBand = () => (
  <section className={resumeBandStyles.root}>
    <div className={resumeBandStyles.inner}>
      <div className={resumeBandStyles.copy}>
        <h2 className={resumeBandStyles.title}>And you never typed it twice</h2>
        <p className={resumeBandStyles.lead}>
          The same data typesets as a document — real LaTeX, not a screenshot of this page. And a
          check that shows you what a recruiter&apos;s software actually reads before you send it
          anywhere.
        </p>
        <Link href="/resume">
          <Button intent="primary">Open the resume editor</Button>
        </Link>
      </div>

      <div>
        <DocumentSheet layout={rendered.layout} skin={defaultResumeSkin} spec={rendered.spec} />
        <div className={resumeBandStyles.pane} data-ui>
          <ExtractedTextPane
            excerptLines={6}
            label="sample · extracted text layer"
            note="Four lines of the text a parser pulls out of the PDF. If a word you searched for is not in here, a keyword search will not find it."
            report={report}
          />
        </div>
      </div>
    </div>
  </section>
)

export const ResumeBandSection = ResumeBand