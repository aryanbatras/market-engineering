import Link from "next/link"
import { footerStyles, navStyles } from "./nav.styles"
import { Button } from "../design/button"

const links = [
  { href: "/features", label: "Features" },
  { href: "/templates", label: "Templates" },
  { href: "/pricing", label: "Pricing" },
]

const legal = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

export const SiteHeader = () => (
  <header className={navStyles.bar}>
    <div className={navStyles.inner}>
      <Link className={navStyles.wordmark} href="/">
        Market Engineering
      </Link>
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
      <p className={footerStyles.wordmarkBig}>Market Engineering</p>
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
        <a className={footerStyles.link} href="mailto:hello@marketengineering.dev">
          hello@marketengineering.dev
        </a>
      </div>
    </div>
    <p className={footerStyles.legal}>© Market Engineering. Templates stay on our servers.</p>
  </footer>
)