import { z } from "zod"

const monthYear = z
  .string()
  .regex(/^(\d{4}(-\d{2})?)$/, "Use YYYY-MM or YYYY")

const year = z.string().regex(/^\d{4}$/, "Use YYYY")

const linkPlatform = z.enum([
  "github",
  "linkedin",
  "twitter",
  "website",
  "email",
  "dribbble",
  "behance",
  "youtube",
  "instagram",
])

const entrySchema = z.object({
  current: z.boolean().default(false),
  start: monthYear,
  end: monthYear.optional(),
  summary: z.string().max(1200).optional(),
  highlights: z.array(z.string().max(300)).max(12).default([]),
})

const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(160),
  degree: z.string().max(160).optional(),
  field: z.string().max(160).optional(),
  start: year.optional(),
  end: year.optional(),
  current: z.boolean().default(false),
  grade: z.string().max(80).optional(),
  details: z.string().max(800).optional(),
})

const experienceSchema = entrySchema.extend({
  organisation: z.string().min(1, "Organisation is required").max(160),
  role: z.string().max(160).optional(),
  location: z.string().max(160).optional(),
})

const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required").max(160),
  description: z.string().max(1200).optional(),
  url: z.union([z.url(), z.literal("")]).optional(),
  repo: z.union([z.url(), z.literal("")]).optional(),
  tech: z.array(z.string().max(60)).max(24).default([]),
  image: z.union([z.url(), z.literal("")]).optional(),
  role: z.string().max(160).optional(),
  timeline: z.string().max(120).optional(),
  featured: z.boolean().default(false),
})

const handleSchema = z
  .string()
  .min(3, "Handle must be at least 3 characters")
  .max(30, "Handle must be 30 characters or fewer")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens")

export const portfolioSchema = z.object({
  portfolioVersion: z.literal(1),
  identity: z.object({
    name: z.string().min(1, "Name is required").max(120),
    headline: z.string().max(160).optional(),
    photo: z.union([z.url(), z.literal("")]).optional(),
    location: z.string().max(120).optional(),
    email: z.union([z.email(), z.literal("")]).optional(),
    phone: z.string().max(40).optional(),
    availability: z.string().max(160).optional(),
  }),
  links: z
    .array(
      z.object({
        platform: linkPlatform,
        label: z.string().max(80).optional(),
        url: z.string().max(400),
      }),
    )
    .max(12)
    .default([]),
  education: z.array(educationSchema).max(12).default([]),
  experience: z.array(experienceSchema).max(20).default([]),
  projects: z.array(projectSchema).max(40).default([]),
  skills: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        group: z.string().max(60).optional(),
      }),
    )
    .max(60)
    .default([]),
  highlights: z.array(z.string().max(240)).max(12).default([]),
  github: z
    .object({
      username: z.string().max(80).optional(),
      lastSyncedAt: z.string().optional(),
    })
    .optional(),
  meta: z
    .object({
      handle: handleSchema.optional(),
      templateId: z.string().max(60).optional(),
    })
    .optional(),
})

export const templateConfigSchema = z.object({
  accent: z.enum(["blue", "ink"]).default("blue"),
  density: z.enum(["compact", "comfortable"]).default("comfortable"),
  dark: z.boolean().default(false),
})

export const publishedPortfolioSchema = z.object({
  handle: handleSchema,
  schemaVersion: z.literal(1),
  templateId: z.string().min(1).max(60),
  config: templateConfigSchema,
  data: portfolioSchema,
  publishedAt: z.string(),
})

export type Portfolio = z.infer<typeof portfolioSchema>
export type PortfolioDraft = z.input<typeof portfolioSchema>
export type TemplateConfig = z.infer<typeof templateConfigSchema>
export type PublishedPortfolio = z.infer<typeof publishedPortfolioSchema>
export type Project = z.infer<typeof projectSchema>
export type Experience = z.infer<typeof experienceSchema>
export type Education = z.infer<typeof educationSchema>