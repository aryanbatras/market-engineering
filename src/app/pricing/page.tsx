import type { Metadata } from "next"
import Link from "next/link"
import { ProsePage } from "@presentation/portfolio/marketing/page"
import { pageStyles } from "@presentation/portfolio/marketing/page.styles"
import { PricingTable } from "@presentation/portfolio/marketing/plans"
import { Button } from "@presentation/core/design/button"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free forever, ₹83 a month, or sponsor us. Three tiers and nothing else.",
}

const PricingPage = () => (
  <ProsePage
    lead="Three tiers. The middle one is the product, and it costs about a dollar. Everything a free user needs to actually get interviews is free."
    title="Three tiers"
  >
    <PricingTable />
    <div className={pageStyles.section}>
      <h2 className={pageStyles.sectionTitle}>Why you do not get the source code</h2>
      <p className={pageStyles.paragraph}>
        If you downloaded a template, you would publish it yourself and we would never see you again. Within
        a week the template would be public, and it would be a free sample of our entire product.
      </p>
      <p className={pageStyles.paragraph}>
        So templates stay on our servers. That is the only reason a one dollar subscription still works for
        you in two years, when we have made six more of them.
      </p>
    </div>
    <div className={pageStyles.section}>
      <h2 className={pageStyles.sectionTitle}>What you can always take with you</h2>
      <p className={pageStyles.paragraph}>
        Your data, as YAML or JSON, on every tier including free. If you ever want to leave, you are one click
        from having all of it, and we would rather that than a refund request.
      </p>
    </div>
  </ProsePage>
)

export default PricingPage
