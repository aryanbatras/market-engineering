import type { Metadata } from "next"
import Link from "next/link"
import { registry } from "@presentation/templates/registry"
import { ProsePage } from "@presentation/marketing/page"
import { pageStyles } from "@presentation/marketing/page.styles"
import { TemplateCard } from "@presentation/builder/template-card"
import { Button } from "@presentation/design/button"

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Five portfolio templates that do not look alike. Four are free, and the fifth is the paid flagship.",
}

const TemplatesPage = () => (
  <ProsePage
    lead="A recruiter who has seen three of ours should be able to tell them apart from the layout alone. Every preview below is the real template, running on this page."
    title="Five templates"
  >
    <div className={pageStyles.action}>
      <Link href="/builder">
        <Button intent="primary">Start building</Button>
      </Link>
    </div>
    <div className={pageStyles.gridWide}>
      {registry.map((entry) => (
        <TemplateCard key={entry.meta.id} meta={entry.meta} />
      ))}
    </div>
    <div className={pageStyles.section}>
      <p className={pageStyles.paragraph}>
        More are coming. Templates inherit the same tokens and own their own composition, so a new one is a
        folder and an afternoon rather than a redesign.
      </p>
      <div className={pageStyles.action}>
        <Link href="/builder">
          <Button intent="primary">Start building</Button>
        </Link>
      </div>
    </div>
  </ProsePage>
)

export default TemplatesPage
