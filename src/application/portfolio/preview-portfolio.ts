import type { Portfolio } from "./portfolio.schema"

export const previewPortfolio: Portfolio = {
  portfolioVersion: 1,
  identity: {
    name: "Ananya Krishnan",
    headline: "Computer science final year. Builds things that mostly work.",
    location: "Coimbatore",
    availability: "Available from June 2027",
  },
  links: [{ platform: "github", label: "github.com/ananyak", url: "https://github.com/ananyak" }],
  education: [
    {
      institution: "Karpagam College of Engineering",
      degree: "B.Tech",
      field: "Computer Science",
      start: "2023",
      end: "2027",
      current: true,
    },
  ],
  experience: [
    {
      organisation: "Zoho",
      role: "Software engineering intern",
      start: "2026-05",
      end: "2026-08",
      current: false,
      summary: "Built a reporting tool that replaced a spreadsheet two teams maintained by hand.",
      highlights: [],
    },
  ],
  projects: [
    {
      name: "Attendance without the queue",
      description: "A lab attendance register that stops the line at the door.",
      tech: ["Next.js", "Postgres"],
      featured: true,
    },
  ],
  skills: [
    { name: "TypeScript", group: "Languages" },
    { name: "React", group: "Frontend" },
    { name: "Postgres", group: "Data" },
  ],
  highlights: [],
  meta: { handle: "ananya", templateId: "classic" },
}
