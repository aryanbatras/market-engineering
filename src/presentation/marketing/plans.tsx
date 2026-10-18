import Link from "next/link"
import { cn } from "@presentation/design/cn"
import { Button } from "@presentation/design/button"
import { pricingStyles } from "@presentation/marketing/home-sections.styles"
import { siteConfig } from "@application/site/site-config"
import { ctaStyles } from "@presentation/marketing/home-sections.styles"

export type Plan = {
  id: string
  name: string
  figure: string
  period: string
  blurb: string
  features: string[]
  featured: boolean
  cta: string
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    figure: "₹0",
    period: "forever",
    blurb: "A working portfolio, for as long as you want it.",
    features: [
      "One published portfolio",
      "Every template",
      "YAML, GitHub, or the form",
      "JSON-LD, social card, PDF export",
      "Export your data any time",
    ],
    featured: false,
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    figure: "₹83",
    period: "per month",
    blurb: "Every template, including Immersive, and no footer badge.",
    features: [
      "Everything in Free",
      "Every template, including new ones",
      "Immersive, the dark one",
      "No Made with love footer",
      "First ask on new templates",
    ],
    featured: true,
    cta: "Get Pro",
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
    cta: "Sponsor us",
  },
]

export const PricingTable = ({ onCta }: { onCta?: (plan: Plan) => void }) => (
  <div className={pricingStyles.grid}>
    {plans.map((plan) => (
      <div className={pricingStyles.plan} key={plan.id}>
        <div className={cn(plan.featured && pricingStyles.planBlue)}>
          <div className={cn(plan.featured && pricingStyles.planBlueInner)}>
            <p className={cn(plan.featured ? pricingStyles.planBlueName : pricingStyles.planName)}>
              {plan.name}
            </p>
            <p className={cn(plan.featured ? pricingStyles.planBlueBlurb : pricingStyles.planBlurb)}>
              {plan.blurb}
            </p>
            <p className={cn(plan.featured ? pricingStyles.planBlueFigure : pricingStyles.figureSmall)}>
              {plan.figure}
              <span className={cn(plan.featured ? pricingStyles.planBluePeriod : pricingStyles.period)}>
                {" "}
                {plan.period}
              </span>
            </p>
          </div>
        </div>
        <ul className={pricingStyles.features}>
          {plan.features.map((feature) => (
            <li
              className={cn(plan.featured ? pricingStyles.planBlueFeature : pricingStyles.feature)}
              key={feature}
            >
              <span
                aria-hidden
                className={cn(plan.featured ? pricingStyles.planBlueMark : pricingStyles.featureMark)}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className={pricingStyles.planAction}>
          {onCta ? (
            <Button block intent={plan.featured ? "accent" : "secondary"} onClick={() => onCta(plan)}>
              {plan.cta}
            </Button>
          ) : (
            <Link href="/builder">
              <Button block intent={plan.featured ? "accent" : "secondary"}>
                {plan.cta}
              </Button>
            </Link>
          )}
        </div>
      </div>
    ))}
  </div>
)

export const ClosingCta = () => (
  <div className={ctaStyles.root}>
    <p className={ctaStyles.sentence}>You already have the work. This is the part that was missing.</p>
    <div className={ctaStyles.action}>
      <Link href="/builder">
        <Button intent="primary">Start building</Button>
      </Link>
      <a className={ctaStyles.secondary} href={`mailto:${siteConfig.email}`}>
        Ask a question first
      </a>
    </div>
  </div>
)