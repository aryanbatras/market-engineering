import { z } from "zod"

export const resumeEntrySchema = z.object({
  title: z.string().max(200).default(""),
  organisation: z.string().max(200).default(""),
  dates: z.string().max(60).default(""),
  meta: z.string().max(200).default(""),
  summary: z.string().max(1200).default(""),
  bullets: z.array(z.string().max(400)).max(12).default([]),
})

export const resumeSectionSchema = z.object({
  id: z.string().max(60),
  title: z.string().max(80),
  kind: z.enum(["experience", "education", "projects", "skills", "highlights"]),
  entries: z.array(resumeEntrySchema).max(40),
})

export const resumeDocumentSchema = z.object({
  name: z.string().min(1, "Name is required").max(160),
  headline: z.string().max(200).default(""),
  contact: z.array(z.string().max(400)).max(10).default([]),
  summary: z.string().max(1200).default(""),
  sections: z.array(resumeSectionSchema).max(10).default([]),
})

export type ResumeEntry = z.infer<typeof resumeEntrySchema>
export type ResumeSection = z.infer<typeof resumeSectionSchema>
export type ResumeSectionKind = ResumeSection["kind"]
export type ResumeDocument = z.infer<typeof resumeDocumentSchema>