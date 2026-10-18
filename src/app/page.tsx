import Link from "next/link"
import { Section, Shell } from "@presentation/design/layout"
import { Button } from "@presentation/design/button"
import { Reveal } from "@presentation/motion/reveal"
import { ScrollProgress, ScrollReveal } from "@presentation/motion/scroll-reveal"
import { heroStyles } from "@presentation/marketing/editor.styles"
import { FaqSection, IntroSection, ShowcaseSection, StepsSection } from "@presentation/marketing/home-sections"
import { TemplatesSection } from "@presentation/marketing/commerce-sections"
import { ClosingCta, PricingTable } from "@presentation/marketing/plans"
import { CompileEditor } from "@presentation/marketing/compile-editor"
import { AtmosphereBand } from "@presentation/marketing/atmosphere"
import { GallerySection } from "@presentation/marketing/gallery"
import { RecruiterSurfaces } from "@presentation/marketing/surfaces"
import { SiteFooter, SiteHeader } from "@presentation/marketing/site-chrome"
import { heroYaml } from "@application/portfolio/hero-yaml"
import { pricingStyles } from "@presentation/marketing/home-sections.styles"

const HomePage = () => (
  <>
    <ScrollProgress />
    <SiteHeader />

    <main>
      <div className={heroStyles.root}>
        <div className={heroStyles.copy}>
          <Reveal as="p" className={heroStyles.kicker} distance={12}>
            For engineering students who cannot code their way out
          </Reveal>
          <Reveal as="h1" className={heroStyles.title} delay={60}>
            Your work, made visible
          </Reveal>
          <Reveal as="p" className={heroStyles.lead} delay={140}>
            Paste your resume as YAML. Pick a template. Get a link a recruiter will actually open, in about
            ten minutes.
          </Reveal>
          <Reveal className={heroStyles.actionRow} delay={220}>
            <Link href="/builder">
              <Button intent="primary">Start building</Button>
            </Link>
            <Link className={heroStyles.secondaryLink} href="/templates">
              See the templates
            </Link>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <CompileEditor initialText={heroYaml} />
          <p className={heroStyles.demoNote}>
            The real parser, running on this page. Edit the YAML on the left and the preview follows.
          </p>
        </Reveal>
      </div>

      <Section spacing="flush">
        <AtmosphereBand />
      </Section>

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
          <ScrollReveal>
            <div data-reveal>
              <ShowcaseSection />
            </div>
          </ScrollReveal>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <RecruiterSurfaces
              headline="Backend engineer. Builds the boring parts that keep the fast parts running."
              name="Your Name"
            />
          </Reveal>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <TemplatesSection />
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