import type { ResumeLayout } from "@application/resume/resume-layout"

export type SchemaField = {
  key: string
  example: string
  list?: boolean
}

export type SchemaGroup = {
  title: string
  fields: SchemaField[]
}

export const documentSchema: SchemaGroup[] = [
  {
    title: "identity",
    fields: [
      { key: "name", example: "Your full name" },
      { key: "headline", example: "Backend engineer. Builds the boring parts." },
      { key: "email", example: "you@example.com" },
      { key: "phone", example: "+91 98765 43210" },
      { key: "location", example: "Bengaluru" },
      { key: "availability", example: "Available from June 2027" },
    ],
  },
  {
    title: "links",
    fields: [{ key: "platform / url", example: "github, https://github.com/you", list: true }],
  },
  {
    title: "experience",
    fields: [
      { key: "organisation", example: "Zoho" },
      { key: "role", example: "Software engineering intern" },
      { key: "location", example: "Chennai" },
      { key: "kind", example: "internship | full-time | volunteer" },
      { key: "start / end", example: "2026-05 / 2026-08" },
      { key: "current", example: "true" },
      { key: "summary", example: "One line on what you owned." },
      { key: "highlights", example: "Cut reporting from four hours to twenty", list: true },
    ],
  },
  {
    title: "projects",
    fields: [
      { key: "name", example: "Ledger for a canteen on IOU" },
      { key: "description", example: "A card scan, a ledger, a number everyone checks." },
      { key: "tech", example: "TypeScript, PostgreSQL", list: true },
      { key: "role", example: "Solo build" },
      { key: "timeline", example: "2026" },
      { key: "featured", example: "true" },
      { key: "url / repo", example: "https://github.com/you/ledger" },
    ],
  },
  {
    title: "education",
    fields: [
      { key: "institution", example: "Karpagam College of Engineering" },
      { key: "degree / field", example: "B.Tech, Computer Science" },
      { key: "board", example: "CBSE" },
      { key: "score", example: "94.2%" },
      { key: "grade", example: "CGPA 8.7" },
      { key: "start / end", example: "2023 / 2027" },
    ],
  },
  {
    title: "skills",
    fields: [{ key: "name / group", example: "TypeScript, Languages", list: true }],
  },
  {
    title: "highlights",
    fields: [{ key: "string", example: "Second place, state hackathon, 2025", list: true }],
  },
]

export const schemaFor = (layout: ResumeLayout): string[] =>
  layout.blocks.filter((block) => block.kind === "heading").map((block) => block.text)