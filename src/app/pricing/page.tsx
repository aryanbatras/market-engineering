import type { Metadata } from "next"
import Link from "next/link"
import { ProsePage } from "@presentation/marketing/page"
import { pageStyles } from "@presentation/marketing/page.styles"
import { pricingStyles } from "@presentation/marketing/home-sections.styles"
import { Button } from "@presentation/design/button"
import { cn } from "@presentation/design/cn"

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free forever, ₹83 a month, or sponsor us. Three tiers and nothing else.",
}

const PlansSection = () => {
  const plans = [
    {
      id: "free",
      name: "Free",
      figure: "₹0",
      period: "forever",
      blurb: "A working portfolio, for as long as you want it.",
      features: [
        "One published portfolio",
        "Four of five templates",
        "YAML, GitHub, or the form",
        "JSON-LD, social card, PDF export",
        "Export your data any time",
      ],
      featured: false,
    },
    {
      id: "pro",
      name: "Pro",
      figure: "₹83",
      period: "per month",
      blurb: "Every template, including Immersive, and no footer badge.",
      features: [
        "Everything in Free",
        "All five templates",
        "Immersive, the 3D one",
        "No Made with love footer",
        "First ask on new templates",
      ],
      featured: true,
    },
    {
      id: "sponsor",
      name: "Sponsor",
      figure: "₹500",
      period: "per month",
      blurb: "If it worked for you, or if you run a placement cell.",
      features: [
        "Everything in Pro",
        "Your name on our sponsors list",
        "Early access to new templates",
        "A line to us that gets answered",
      ],
      featured: false,
    },
  ]

  return (
    <>
      <div className={pricingStyles.grid}>
        {plans.map((plan) => (
          <div className={pricingStyles.plan} key={plan.id}>
            <div>
              <p className={pricingStyles.planName}>
                {plan.name}
                {plan.featured ? <span className={pricingStyles.sponsored}>Most chosen</span> : null}
              </p>
              <p className={pricingStyles.planBlurb}>{plan.blurb}</p>
            </div>
            <p className={pricingStyles.figureSmall}>
              {plan.figure}
              <span className={pricingStyles.period}> {plan.period}</span>
            </p>
            <ul className={pricingStyles.features}>
              {plan.features.map((feature) => (
                <li className={pricingStyles.feature} key={feature}>
                  <span
                    aria-hidden
                    className={plan.featured ? pricingStyles.featureMarkOn : pricingStyles.featureMark}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className={pricingStyles.planAction}>
              <Link href="/builder">
                <Button block intent={plan.featured ? "accent" : "secondary"}>
                  {plan.id === "free" ? "Start free" : plan.id === "pro" ? "Get Pro" : "Sponsor us"}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const PricingPage = () => (
  <ProsePage
    lead="Three tiers. The middle one is the product, and it costs about a dollar. Everything a free user needs to actually get interviews is free."
    title="Three tiers"
  >
    <PlansSection />
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
