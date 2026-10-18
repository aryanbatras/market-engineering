import Link from "next/link"
import { Section, Shell } from "@presentation/design/layout"
import { Button } from "@presentation/design/button"
import { Reveal } from "@presentation/motion/reveal"
import { heroStyles } from "@presentation/marketing/compile-demo.styles"
import { FaqSection, IntroSection, ShowcaseSection, StepsSection } from "@presentation/marketing/home-sections"
import { CtaSection, PricingSection, TemplatesSection } from "@presentation/marketing/commerce-sections"
import { CompileDemo } from "@presentation/marketing/compile-demo"
import { RecruiterSurfaces } from "@presentation/marketing/surfaces"
import { SiteFooter, SiteHeader } from "@presentation/marketing/site-chrome"

const HomePage = () => (
  <>
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
            Paste your resume as YAML. Pick a template. Get a link a recruiter will actually open, in about ten
            minutes.
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
        <Reveal className={heroStyles.demo} delay={120}>
          <CompileDemo />
          <p className={heroStyles.demoNote}>This is the real parser, running on this page. Hover to hold it.</p>
        </Reveal>
      </div>

      <Section>
        <Shell>
          <Reveal>
            <IntroSection />
          </Reveal>
        </Shell>
      </Section>

      <Section spacing="flush">
        <StepsSection />
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <ShowcaseSection />
          </Reveal>
        </Shell>
      </Section>

      <Section>
        <Shell>
          <Reveal>
            <RecruiterSurfaces headline="Computer science final year. Builds things that mostly work." name="Ananya Krishnan" />
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
            <PricingSection />
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
          <CtaSection />
        </Reveal>
      </Section>
    </main>

    <SiteFooter />
  </>
)

export default HomePage