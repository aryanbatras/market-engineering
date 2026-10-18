import type { PortfolioDraft } from "./portfolio.schema"

export const samplePortfolio: PortfolioDraft = {
  portfolioVersion: 1,
  identity: {
    name: "Your Name",
    headline: "Backend engineer. Builds the boring parts that keep the fast parts running.",
    location: "Coimbatore, India",
    email: "you@example.com",
    availability: "Available from June 2027",
  },
  links: [
    { platform: "github", label: "github.com/yourname", url: "https://github.com/yourname" },
    { platform: "linkedin", label: "linkedin.com/in/yourname", url: "https://linkedin.com/in/yourname" },
    { platform: "website", label: "yourname.dev", url: "https://yourname.dev" },
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
        "Owned the reporting pipeline behind a weekly business review used by four teams, and made it stop depending on a spreadsheet.",
      highlights: [
        "Cut report preparation from four hours a week to twenty minutes",
        "Moved 6 years of history into Postgres and added incremental refresh",
        "Wrote the contract tests that stopped three regressions in one quarter",
      ],
    },
    {
      organisation: "College Coding Club",
      role: "Core committee, events",
      location: "Coimbatore",
      start: "2024-06",
      end: "2026-04",
      current: false,
      summary: "Ran the weekly build nights and the inter-college hackathon.",
      highlights: ["Organised a 120-person hackathon across four colleges"],
    },
  ],
  projects: [
    {
      name: "Ledger for a canteen that runs on IOU",
      description:
        "The canteen ran on paper credits and arguments. This replaces both: a card scan, a ledger, and a number everyone can check.",
      tech: ["TypeScript", "PostgreSQL", "Next.js"],
      role: "Solo build",
      timeline: "2026",
      featured: true,
    },
    {
      name: "Rate limiter that survived load testing",
      description:
        "A token bucket in Redis, written to learn how distributed rate limiting actually fails under real traffic.",
      tech: ["Go", "Redis", "Docker"],
      role: "Learning in public",
      timeline: "2026",
      featured: true,
    },
    {
      name: "Query cost dashboard",
      description:
        "Reads slow query logs, groups them by shape, and shows which ones cost the most. Found a 9-second query hiding behind a dashboard nobody owned.",
      tech: ["Python", "ClickHouse", "Metabase"],
      role: "Solo build",
      timeline: "2025",
      featured: true,
    },
    {
      name: "A tiny search engine",
      description: "Inverted index, BM25 ranking, about 900 lines. Not fast. Understandable.",
      tech: ["Rust"],
      role: "Coursework",
      timeline: "2025",
    },
    {
      name: "Mess menu, without the group chat chaos",
      description: "Reads the canteen board, posts it once, stops forty people asking.",
      tech: ["Python"],
      role: "Weekend project",
      timeline: "2024",
    },
  ],
  skills: [
    { name: "TypeScript", group: "Languages" },
    { name: "Go", group: "Languages" },
    { name: "Python", group: "Languages" },
    { name: "PostgreSQL", group: "Data" },
    { name: "Redis", group: "Data" },
    { name: "Docker", group: "Tools" },
    { name: "AWS", group: "Tools" },
    { name: "Figma", group: "Tools" },
  ],
  highlights: [
    "Second place, state-level inter-college hackathon, 2025",
    "Departmental topper in the database systems course, 2025",
  ],
  github: { username: "yourname" },
  meta: {
    handle: "yourname",
    templateId: "classic",
  },
}