import Link from "next/link"
import { footerStyles, navStyles } from "./nav.styles"
import { Button } from "../design/button"
import { Wordmark } from "./wordmark"
import { siteConfig } from "@application/site/site-config"

const links = [
  { href: "/features", label: "Features" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
]

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/credits", label: "Credits" },
]

export const SiteHeader = () => (
  <header className={navStyles.bar}>
    <div className={navStyles.inner}>
      <Wordmark />
      <nav aria-label="Main" className={navStyles.links}>
        {links.map((link) => (
          <Link className={navStyles.link} href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className={navStyles.actions}>
        <Link className={navStyles.link} href="/sign-in">
          Sign in
        </Link>
        <Link href="/builder">
          <Button intent="primary" size="small">
            Start building
          </Button>
        </Link>
      </div>
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
          siteConfig.email
        </a>
      </div>
    </div>
    <p className={footerStyles.legal}>{`© ${new Date().getFullYear()} ${siteConfig.name}. Templates stay on our servers.`}</p>
  </footer>
)