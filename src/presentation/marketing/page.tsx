import type { ReactNode } from "react"
import { Section, Shell } from "@presentation/design/layout"
import { Reveal } from "@presentation/motion/reveal"
import { pageStyles } from "./page.styles"
import { SiteFooter, SiteHeader } from "./site-chrome"

type ProsePageProps = {
  title: string
  lead: string
  children: ReactNode
}

export const ProsePage = ({ title, lead, children }: ProsePageProps) => (
  <>
    <SiteHeader sticky={false} />
    <main>
      <Shell className={pageStyles.proseHeader}>
        <header>
          <Reveal as="h1" className={pageStyles.proseTitle}>
            {title}
          </Reveal>
          <Reveal as="p" className={pageStyles.proseLead} delay={80}>
            {lead}
          </Reveal>
        </header>
      </Shell>
      <Section>
        <Shell>
          <Reveal>{children}</Reveal>
        </Shell>
      </Section>
    </main>
    <SiteFooter />
  </>
)
