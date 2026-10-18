import type { Metadata } from "next"
import { ProsePage } from "@presentation/portfolio/marketing/page"
import { pageStyles } from "@presentation/portfolio/marketing/page.styles"
import { TemplateGallery } from "@presentation/portfolio/builder/template-gallery"

export const metadata: Metadata = {
  title: "Templates",
  description: "Portfolio templates that do not look alike. Every preview is the real template, running.",
}

const TemplatesPage = () => (
  <ProsePage
    lead="Every preview below is the real template, running on this page with real content in it."
    title="Templates"
  >
    <TemplateGallery />
    <div className={pageStyles.section}>
      <p className={pageStyles.paragraph}>
        More are coming. Templates inherit the same tokens and own their own composition, so a new one is a
        folder and an afternoon rather than a redesign.
      </p>
    </div>
  </ProsePage>
)

export default TemplatesPage
