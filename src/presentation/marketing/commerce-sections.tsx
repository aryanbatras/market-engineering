import Link from "next/link"
import { cn } from "@presentation/design/cn"
import { Button } from "../design/button"
import { pricingStyles, templatesStyles, ctaStyles } from "./home-sections.styles"
import * as homeStyles from "./home-sections.styles"

const templates = [
  {
    name: "Classic",
    tag: "Free",
    span: "md:col-span-5",
    projects: [
      { name: "Attendance without the queue", body: "A lab register that stops the line at the door." },
      { name: "Mess menu scraper", body: "Reads the canteen board, posts it to a group chat." },
    ],
  },
  {
    name: "Bento",
    tag: "Free",
    span: "md:col-span-7",
    projects: [
      { name: "Second-year compiler notes", body: "One grammar at a time, written up properly." },
      { name: "Canteen queue timer", body: "How long the line is, from the gate." },
      { name: "Lab attendance register", body: "Scan, log, summarise." },
      { name: "First-year Arduino lamp", body: "It blinks. It is still my favourite thing I built." },
    ],
  },
]

export const TemplatesSection = () => (
  <>
    <h2 className={templatesStyles.heading}>Five templates, and they do not look alike</h2>
    <p className={templatesStyles.body}>
      A recruiter who has seen three of ours should be able to tell them apart from the layout alone. That is
      the bar each one has to clear.
    </p>
    <div className={templatesStyles.grid}>
      {templates.map((template) => (
        <div className={cn(templatesStyles.card, template.span)} key={template.name}>
          <div className={templatesStyles.cardHead}>
            <span className={templatesStyles.cardName}>{template.name}</span>
            <span className={templatesStyles.cardTag}>{template.tag}</span>
          </div>
          <div className={templatesStyles.cardBody}>
            {template.projects.map((project) => (
              <div key={project.name}>
                <p className={templatesStyles.projectName}>{project.name}</p>
                <p className={templatesStyles.projectBody}>{project.body}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <Link className={templatesStyles.more} href="/templates">
      See all templates
    </Link>
  </>
)

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
      "No &ldquo;Made with love&rdquo; footer",
      "First ask on new templates",
    ],
    featured: true,
  },
  {
    id: "sponsor",
    name: "Sponsor",
    figure: "₹500",
    period: "per month",
    blurb: "If it worked for you, or if you are a placement cell.",
    features: [
      "Everything in Pro",
      "Your name on our sponsors list",
      "Early access to new templates",
      "A line to us that gets answered",
    ],
    featured: false,
  },
]

export const PricingSection = () => (
  <>
    <h2 className={pricingStyles.title}>Three tiers, one of them a dollar</h2>
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

export const CtaSection = () => (
  <div className={ctaStyles.root}>
    <p className={ctaStyles.sentence}>
      You already have the work. This is the part that was missing.
    </p>
    <div className={ctaStyles.action}>
      <Link href="/builder">
        <Button intent="primary">Start building</Button>
      </Link>
    </div>
  </div>
)