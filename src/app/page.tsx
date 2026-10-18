import Link from "next/link"
import { Section, Shell } from "@presentation/design/layout"
import { Button } from "@presentation/design/button"
import { Reveal } from "@presentation/motion/reveal"
import { ScrollProgress, ScrollReveal } from "@presentation/motion/scroll-reveal"
import { heroStyles } from "@presentation/marketing/editor.styles"
import { FaqSection, IntroSection } from "@presentation/marketing/home-sections"
import { StepsSection } from "@presentation/marketing/sections-flow"
import { ClosingCta, PricingTable } from "@presentation/marketing/plans"
import { CompileEditor } from "@presentation/marketing/compile-editor"
import { BuildTimeline } from "@presentation/marketing/build-timeline"
import { AtmosphereBand, GallerySection } from "@presentation/marketing/gallery"
import { RecruiterSurfaces } from "@presentation/marketing/surfaces"
import { TemplateGallery } from "@presentation/builder/template-gallery"
import { SiteFooter, SiteHeader } from "@presentation/marketing/site-chrome"
import { heroYaml } from "@application/portfolio/hero-yaml"
import { pricingStyles } from "@presentation/marketing/home-sections.styles"
import { previewPortfolio } from "@application/portfolio/preview-portfolio"

const HomePage = () => (
  <>
    <ScrollProgress />
    <SiteHeader />

    <main>
      <div className={heroStyles.root}>
        <div className={heroStyles.copy}>
          <Reveal as="h1" className={heroStyles.title} delay={40}>
            Your work, made visible
          </Reveal>
          <Reveal as="p" className={heroStyles.lead} delay={120}>
            Your resume in, a portfolio site out. Ten minutes, one link, and no design decisions in between.
          </Reveal>
          <Reveal className={heroStyles.actionRow} delay={200}>
            <Link href="/builder">
              <Button intent="primary">Start building</Button>
            </Link>
            <Link className={heroStyles.secondaryLink} href="/templates">
              See the templates
            </Link>
          </Reveal>
        </div>
        <Reveal delay={100}>
          <div>
            <CompileEditor initialText={heroYaml} />
            <BuildTimeline />
          </div>
        </Reveal>
      </div>

      <AtmosphereBand />

      <Section>
        <Shell>
          <Reveal>
            <IntroSection />
          </Reveal>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <GallerySection />
          </Reveal>
        </Shell>
      </Section>

      <Section spacing="flush">
        <StepsSection />
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <RecruiterSurfaces headline={previewPortfolio.identity.headline ?? ""} name={previewPortfolio.identity.name} />
          </Reveal>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <TemplateGallery heading="Templates" limit={3} />
          </Reveal>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <h2 className={pricingStyles.title}>Three tiers, one of them a dollar</h2>
            <div data-reveal>
              <PricingTable />
            </div>
          </Reveal>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <FaqSection />
          </Reveal>
        </Shell>
      </Section>

      <Section spacing="flush">
        <Reveal>
          <ClosingCta />
        </Reveal>
      </Section>
    </main>

    <SiteFooter />
  </>
)

export default HomePage