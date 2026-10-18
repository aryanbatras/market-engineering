const DEFAULT_ORIGIN = "http://localhost:3000"

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

export const siteConfig = {
  origin: trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_ORIGIN),
  name: "Market Engineering",
  tagline: "Your work, made visible",
  description:
    "Turn the resume and GitHub you already have into a portfolio a recruiter actually reads.",
  locale: "en_IN",
  email: "hello@marketengineering.dev",
} as const

export const portfolioUrl = (handle: string): string => `${siteConfig.origin}/p/${handle}`

export const handleFromPath = (value: string): string => value.trim().toLowerCase()
