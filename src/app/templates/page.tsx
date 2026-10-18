import type { Metadata } from "next"
import Link from "next/link"
import { ProsePage } from "@presentation/portfolio/marketing/page"
import { pageStyles } from "@presentation/portfolio/marketing/page.styles"
import { TemplateGallery } from "@presentation/portfolio/builder/template-gallery"

export const metadata: Metadata = {
  title: "Portfolio templates",
  description:
    "Portfolio templates that do not look alike. Every preview is the real template, running.",
}

const TemplatesPage = () => (
  <ProsePage
    lead="Every preview below is the real template, running on this page with real content in it. Click one and the editor opens with it already loaded."
    title="Portfolio templates"
  >
    <TemplateGallery linked />
    <div className={pageStyles.section}>
      <p className={pageStyles.paragraph}>
        We only ship layouts that people actually recognise, so a recruiter who has seen a hundred
        resumes knows what they are looking at before they read a word. More are coming. Templates
        inherit the same tokens and own their own composition, so a new one is a folder and an
        afternoon rather than a redesign.
      </p>
      <p className={pageStyles.paragraph}>
        Want the document instead? The same data typesets as a resume in ten popular layouts.{" "}
        <Link className={pageStyles.paragraphLink} href="/resume/templates">
          See the resume templates
        </Link>
        .
      </p>
    </div>
  </ProsePage>
)

export default TemplatesPage
