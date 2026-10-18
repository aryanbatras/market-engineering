import type { PortfolioDraft } from "./portfolio.schema"

export const samplePortfolio: PortfolioDraft = {
  portfolioVersion: 1,
  identity: {
    name: "Ananya Krishnan",
    headline: "Computer science final year. Builds things that mostly work.",
    location: "Coimbatore, India",
    email: "ananya@example.com",
    availability: "Available from June 2027",
  },
  links: [
    { platform: "github", label: "github.com/ananyak", url: "https://github.com/ananyak" },
    { platform: "linkedin", label: "linkedin.com/in/ananyak", url: "https://linkedin.com/in/ananyak" },
  ],
  education: [
    {
      institution: "Karpagam College of Engineering",
      degree: "B.Tech",
      field: "Computer Science",
      start: "2023",
      end: "2027",
      current: true,
      grade: "CGPA 8.7",
    },
  ],
  experience: [
    {
      organisation: "Zoho",
      role: "Software engineering intern",
      location: "Chennai",
      start: "2026-05",
      end: "2026-08",
      current: false,
      summary:
        "Built an internal reporting tool that replaced a spreadsheet two teams were maintaining by hand.",
      highlights: [
        "Cut weekly report preparation from four hours to twenty minutes",
        "Wrote the query layer against Postgres and added a read-only API",
      ],
    },
  ],
  projects: [
    {
      name: "Attendance without the queue",
      description:
        "A lab attendance register that stops the line at the door. Students scan, it logs, staff read a summary.",
      tech: ["Next.js", "Postgres", "Supabase"],
      role: "Solo",
      timeline: "2026",
      featured: true,
    },
    {
      name: "Second-year compiler notes",
      description: "Working through a compiler course, one grammar at a time, written up properly.",
      tech: ["C", "LLVM"],
      role: "Learning in public",
      timeline: "2025",
      featured: true,
    },
    {
      name: "Mess menu scraper",
      description: "Reads the canteen menu board and posts it to a group chat. Saved my friends a daily decision.",
      tech: ["Python"],
      role: "Weekend project",
      timeline: "2024",
    },
  ],
  skills: [
    { name: "TypeScript", group: "Languages" },
    { name: "Python", group: "Languages" },
    { name: "React", group: "Frontend" },
    { name: "Postgres", group: "Data" },
    { name: "Figma", group: "Tools" },
  ],
  highlights: [
    "Won second place at the state-level hackathon, 2025",
    "Core committee member, Coding Club",
  ],
  meta: {
    handle: "ananya",
    templateId: "classic",
  },
}