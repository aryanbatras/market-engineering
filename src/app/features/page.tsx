import type { Metadata } from "next"
import Link from "next/link"
import { ProsePage } from "@presentation/marketing/page"
import { pageStyles } from "@presentation/marketing/page.styles"
import { Button } from "@presentation/design/button"

export const metadata: Metadata = {
  title: "Features",
  description: "Three ways in, five templates, and the surfaces a recruiter actually opens.",
}

const features = [
  {
    title: "Paste it as YAML",
    body: "Ask any AI to convert your resume using our prompt, then paste what comes back. It is validated against a real schema as you type, and errors tell you which line is wrong.",
  },
  {
    title: "Connect GitHub",
    body: "Your repositories, languages, and descriptions become projects. It merges in as an addition, never overwriting what you typed, and you choose which repos to include.",
  },
  {
    title: "Or just fill in the form",
    body: "No YAML, no AI. The same fields, written for a human. Only a name is required, because a short portfolio still beats no portfolio.",
  },
]

const surfaces = [
  {
    title: "A link they will actually open",
    body: "Your own handle, not a page on ours with an id in the URL. That difference matters when the link travels through WhatsApp.",
  },
  {
    title: "A social card",
    body: "Every portfolio gets a card with your name and headline on it, so sharing it does not look like every other shared link.",
  },
  {
    title: "A PDF that reads well",
    body: "Generated from the same data, for the application form that insists on an attachment.",
  },
  {
    title: "Structured data for parsers",
    body: "Your page ships Person schema, so recruitment tools can read it instead of guessing.",
  },
]

const FeaturesPage = () => (
  <ProsePage
    lead="Three ways to get your information in, five templates that do not look alike, and the surfaces a recruiter actually opens. Nothing you do not need."
    title="What it does"
  >
    <div className={pageStyles.section}>
      <h2 className={pageStyles.sectionTitle}>Getting your data in</h2>
      <div className={pageStyles.grid}>
        {features.map((feature) => (
          <div className={pageStyles.card} key={feature.title}>
            <h3 className={pageStyles.cardName}>{feature.title}</h3>
            <p className={pageStyles.cardBody}>{feature.body}</p>
          </div>
        ))}
      </div>
    </div>

    <div className={pageStyles.section}>
      <h2 className={pageStyles.sectionTitle}>What a recruiter gets</h2>
      <div className={pageStyles.grid}>
        {surfaces.map((surface) => (
          <div className={pageStyles.card} key={surface.title}>
            <h3 className={pageStyles.cardName}>{surface.title}</h3>
            <p className={pageStyles.cardBody}>{surface.body}</p>
          </div>
        ))}
      </div>
    </div>

    <div className={pageStyles.section}>
      <Link href="/builder">
        <Button intent="primary">Start building</Button>
      </Link>
    </div>
  </ProsePage>
)

export default FeaturesPage
