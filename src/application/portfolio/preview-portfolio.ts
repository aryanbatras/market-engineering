import type { Portfolio } from "./portfolio.schema"

export const previewPortfolio: Portfolio = {
  portfolioVersion: 1,
  identity: {
    name: "Naina Kumari",
    headline: "Backend engineer. Builds the boring parts that keep the fast parts running.",
    location: "Bengaluru",
    availability: "Available from June 2027",
  },
  links: [{ platform: "github", label: "github.com/nainakumari", url: "https://github.com/nainakumari" }],
  education: [
    {
      institution: "Karpagam College of Engineering",
      degree: "B.Tech",
      field: "Computer Science",
      start: "2023",
      end: "2027",
      current: true,
      grade: "CGPA 8.7",
      score: "94.2%",
      board: "CBSE",
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
      kind: "internship",
      summary: "Owned the reporting pipeline behind a weekly business review used by four teams.",
      highlights: ["Cut report preparation from four hours a week to twenty minutes"],
    },
  ],
  projects: [
    {
      name: "Ledger for a canteen that runs on IOU",
      description: "A card scan, a ledger, and a number everyone can check.",
      tech: ["TypeScript", "PostgreSQL", "Next.js"],
      featured: true,
    },
    {
      name: "Rate limiter that survived load testing",
      description: "A token bucket in Redis, written to learn how rate limiting fails under traffic.",
      tech: ["Go", "Redis"],
      featured: true,
    },
  ],
  skills: [
    { name: "TypeScript", group: "Languages" },
    { name: "Go", group: "Languages" },
    { name: "PostgreSQL", group: "Data" },
  ],
  highlights: ["Second place, state-level hackathon, 2025"],
  meta: { handle: "nainakumari", templateId: "classic" },
}