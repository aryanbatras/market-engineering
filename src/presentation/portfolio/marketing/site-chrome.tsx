import Link from "next/link"
import { footerStyles, navStyles } from "./nav.styles"
import { Button } from "@presentation/core/design/button"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { SessionActions } from "./session-actions"
import { siteConfig } from "@application/core/site/site-config"

const links = [
  { href: "/features", label: "Features" },
  { href: "/templates", label: "Portfolio templates" },
  { href: "/resume/templates", label: "Resume templates" },
  { href: "/pricing", label: "Pricing" },
]

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/credits", label: "Credits" },
]

type SiteHeaderProps = {
  sticky?: boolean
}

export const SiteHeader = ({ sticky = true }: SiteHeaderProps) => (
  <header className={sticky ? navStyles.bar : navStyles.barStatic}>
    <div className={navStyles.inner}>
      <Wordmark />
      <nav aria-label="Main" className={navStyles.links}>
        {links.map((link) => (
          <Link className={navStyles.link} href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <SessionActions />
    </div>
    <nav aria-label="Main, compact" className={navStyles.mobileRow}>
      {links.map((link) => (
        <Link className={navStyles.mobileLink} href={link.href} key={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  </header>
)

export const SiteFooter = () => (
  <footer className={footerStyles.root}>
    <div className={footerStyles.top}>
      <Wordmark className={footerStyles.wordmarkBig} size="display" />
      <div className={footerStyles.column}>
        <p className={footerStyles.columnTitle}>Product</p>
        {links.map((link) => (
          <Link className={footerStyles.link} href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className={footerStyles.column}>
        <p className={footerStyles.columnTitle}>Legal</p>
        {legal.map((link) => (
          <Link className={footerStyles.link} href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className={footerStyles.column}>
        <p className={footerStyles.columnTitle}>Get in touch</p>
        <a className={footerStyles.link} href={`mailto:${siteConfig.email}`}>
          {siteConfig.email}
        </a>
      </div>
    </div>
    <p className={footerStyles.legal}>{`© ${new Date().getFullYear()} ${siteConfig.name}. Templates stay on our servers.`}</p>
  </footer>
)