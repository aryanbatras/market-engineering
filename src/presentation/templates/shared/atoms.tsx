import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { LuArrowUpRight } from "react-icons/lu"
import { atomsStyles } from "./atoms.styles"

type AvatarProps = {
  name: string
  photo?: string
  size?: "sm" | "md"
}

const initialsOf = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

export const Avatar = ({ name, photo, size = "md" }: AvatarProps) => (
  <div className={atomsStyles.avatar}>
    {photo ? (
      <img alt="" className={atomsStyles.avatarImage} height={64} src={photo} width={64} />
    ) : (
      <span className={atomsStyles.avatarInitials} style={{ fontSize: size === "sm" ? "1.25rem" : undefined }}>
        {initialsOf(name)}
      </span>
    )}
  </div>
)

type SectionLabelProps = {
  children: string
}

export const SectionLabel = ({ children }: SectionLabelProps) => (
  <p className={atomsStyles.eyebrow}>{children}</p>
)

type TagRowProps = {
  items: string[]
  as?: "li" | "span"
}

export const TagRow = ({ items, as = "span" }: TagRowProps) => {
  if (items.length === 0) return null
  const Tag = as
  return (
    <ul className={atomsStyles.tagRow}>
      {items.map((item) => (
        <li className={atomsStyles.tag} key={item}>
          {item}
        </li>
      ))}
    </ul>
  )
}

type ExternalLinkProps = {
  href: string
  children: string
}

export const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <a className={atomsStyles.externalLink} href={href} rel="noreferrer" target="_blank">
    <span>{children}</span>
    <LuArrowUpRight aria-hidden size={14} strokeWidth={1.5} />
  </a>
)

type AttributionProps = {
  visible: boolean
}

export const Attribution = ({ visible }: AttributionProps) => {
  if (!visible) return null
  return (
    <footer className={atomsStyles.footer}>
      <p>Made with love · Market Engineering</p>
    </footer>
  )
}

type IdentityLineProps = {
  portfolio: Portfolio
}

export const ContactLine = ({ portfolio }: IdentityLineProps) => {
  const parts = [portfolio.identity.location, portfolio.identity.email].filter(Boolean)
  if (parts.length === 0) return null
  return <p className={atomsStyles.eyebrow}>{parts.join(" · ")}</p>
}

export const PlatformLinks = ({ portfolio }: IdentityLineProps) => {
  if (portfolio.links.length === 0) return null
  return (
    <div className={atomsStyles.row}>
      {portfolio.links.map((link) => (
        <ExternalLink href={link.url} key={`${link.platform}-${link.url}`}>
          {link.label ?? link.platform}
        </ExternalLink>
      ))}
    </div>
  )
}

export const AvailabilityLine = ({ portfolio }: IdentityLineProps) => {
  if (!portfolio.identity.availability) return null
  return <p className={atomsStyles.eyebrow}>{portfolio.identity.availability}</p>
}