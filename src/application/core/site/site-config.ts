const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "")

const read = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim()
  return trimmed !== undefined && trimmed.length > 0 ? trimmed : fallback
}

const name = read(process.env.NEXT_PUBLIC_SITE_NAME, "Standout")

export const siteConfig = {
  name,
  origin: stripTrailingSlash(read(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000")),
  email: read(process.env.NEXT_PUBLIC_SITE_EMAIL, "hello@standout.dev"),
  contactEmail: read(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "hello@standout.dev"),
  tagline: "Your work, made visible",
  description:
    "Paste your resume as YAML, pick a template, and get a link a recruiter will actually open.",
  locale: "en_IN",
} as const

export const portfolioUrl = (handle: string): string => `${siteConfig.origin}/p/${handle}`

export const siteTitle = (title?: string): string =>
  title === undefined ? `${siteConfig.name} — ${siteConfig.tagline}` : `${title} · ${siteConfig.name}`