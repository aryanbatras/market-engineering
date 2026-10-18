import Link from "next/link";
import { Section, Shell } from "@presentation/core/design/layout";
import { Button } from "@presentation/core/design/button";
import { Reveal } from "@presentation/core/motion/reveal";
import {
  ScrollProgress,
  ScrollReveal,
} from "@presentation/core/motion/scroll-reveal";
import { heroStyles } from "@presentation/portfolio/marketing/editor.styles";
import {
  FaqSection,
  IntroSection,
} from "@presentation/portfolio/marketing/home-sections";
import {
  ClosingCta,
  PricingTable,
} from "@presentation/portfolio/marketing/plans";
import { CompileEditor } from "@presentation/portfolio/marketing/compile-editor";
import { FlowLine } from "@presentation/portfolio/marketing/flow-line";
import { ScrollRail } from "@presentation/portfolio/marketing/scroll-rail";
import {
  AtmosphereBand,
  GallerySection,
} from "@presentation/portfolio/marketing/gallery";
import { RecruiterSurfaces } from "@presentation/portfolio/marketing/surfaces";
import { TemplateGallery } from "@presentation/portfolio/builder/template-gallery";
import { ResumeBandSection } from "@presentation/resume/marketing/resume-band"
import { ResumeTemplateShelf } from "@presentation/resume/marketing/resume-shelf";
import {
  SiteFooter,
  SiteHeader,
} from "@presentation/portfolio/marketing/site-chrome";
import { heroYaml } from "@application/portfolio/document-yaml";
import { pricingStyles } from "@presentation/portfolio/marketing/home-sections.styles";
import { previewPortfolio } from "@application/portfolio/preview-portfolio";

const HomePage = () => (
  <>
    <ScrollProgress />
    <SiteHeader />

    <main className={heroStyles.page}>
      <FlowLine />
      <div className={heroStyles.pageBody}>
        <div className={heroStyles.root}>
          <div className={heroStyles.copy}>
            <Reveal as="h1" className={heroStyles.title} delay={40}>
              Your work, made visible
            </Reveal>
            <Reveal as="p" className={heroStyles.lead} delay={120}>
              Your resume in, a portfolio site out. Ten minutes, one link, and
              no design decisions in between.
            </Reveal>
            <Reveal
              className={heroStyles.actionRow}
              delay={200}
              data-flow-trunk="hero"
            >
              <Link href="/start" data-flow="start">
                <Button intent="primary">Start building</Button>
              </Link>
              <Link className={heroStyles.secondaryLink} href="/templates">
                See the templates
              </Link>
            </Reveal>
          </div>
          <Reveal delay={100}>
            <CompileEditor initialText={heroYaml} />
          </Reveal>
        </div>

        <Section spacing="flush">
          <ScrollRail />
        </Section>

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

        <Section>
          <Shell>
            <Reveal>
              <RecruiterSurfaces
                headline={previewPortfolio.identity.headline ?? ""}
                name={previewPortfolio.identity.name}
              />
            </Reveal>
          </Shell>
        </Section>

        <Section>
          <Shell>
            <Reveal>
              <TemplateGallery heading="Portfolio templates" limit={3} />
            </Reveal>
          </Shell>
        </Section>

        <ResumeBandSection />

      <Section spacing="flush">
        <Reveal>
          <ResumeTemplateShelf />
        </Reveal>
      </Section>

        <Section>
          <Shell>
            <Reveal>
              <h2 className={pricingStyles.title}>
                Three tiers, one of them a dollar
              </h2>
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
      </div>
    </main>

    <SiteFooter />
  </>
);

export default HomePage;
