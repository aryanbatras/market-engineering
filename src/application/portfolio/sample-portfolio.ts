import type { PortfolioDraft } from "./portfolio.schema"

export const samplePortfolio: PortfolioDraft = {
  portfolioVersion: 1,
  identity: {
    name: "Naina Kumari",
    headline: "Backend engineer. Go, Postgres, and the unglamorous parts in between.",
    location: "Bengaluru, India",
    email: "naina.kumari@example.com",
    availability: "Available from June 2027",
  },
  links: [
    { platform: "github", label: "github.com/nainakumari", url: "https://github.com/nainakumari" },
    { platform: "linkedin", label: "linkedin.com/in/nainakumari", url: "https://linkedin.com/in/nainakumari" },
  ],
  education: [
    {
      institution: "National Institute of Technology",
      degree: "B.Tech",
      field: "Computer Science",
      start: "2023",
      end: "2027",
      current: true,
      grade: "CGPA 9.1",
    },
  ],
  experience: [
    {
      organisation: "Razorpay",
      role: "Software engineering intern, payments infrastructure",
      location: "Bengaluru",
      start: "2026-04",
      end: "2026-09",
      current: false,
      summary:
        "Second engineer on the settlement reconciliation service that clears about ₹40,000 crore a month. Own the query layer and the alerting around it.",
      highlights: [
        "Rewrote a nightly reconciliation job from 95 minutes to 6, with incremental batching and a backfill path that survived 18 months of new edge cases",
        "Cut p99 settlement latency from 2.4s to 310ms by fixing three N+1 reads on the hot path",
        "Wrote the integration tests that caught a double-credit regression before it reached production",
      ],
    },
    {
      organisation: "Freelance",
      role: "Backend developer",
      start: "2025-06",
      end: "2026-01",
      current: false,
      summary: "Built and maintained a booking service for a regional clinic chain.",
      highlights: [
        "Held the service through 40k appointments without a page, on a single small instance",
        "Replaced a spreadsheet-based insurance claim tracker with an audited Postgres schema",
      ],
    },
  ],
  projects: [
    {
      name: "Consensus log, from scratch",
      description:
        "Raft leader election and log replication in Go, written to understand why distributed consensus is hard rather than to ship it. Includes deterministic simulation of partition and heal scenarios.",
      tech: ["Go", "gRPC", "Raft"],
      role: "Solo build",
      timeline: "2026",
      featured: true,
    },
    {
      name: "Rate limiter that degrades correctly",
      description:
        "Token bucket in Redis with a local in-memory fallback, so a Redis blip sheds load instead of taking the service down. 40k req/s on a laptop.",
      tech: ["Go", "Redis", "Docker"],
      role: "Solo build",
      timeline: "2026",
      featured: true,
    },
    {
      name: "Query cost dashboard",
      description:
        "Pulls slow query logs, groups them by normalised shape, and ranks them by total time cost. Surfaced a 9-second query hiding behind a dashboard nobody owned.",
      tech: ["Python", "ClickHouse", "FastAPI"],
      role: "Solo build",
      timeline: "2025",
      featured: true,
    },
    {
      name: "SQL query optimiser",
      description: "A join-order search over a real schema. Explains the plan it picked and what it would have cost otherwise.",
      tech: ["Java", "PostgreSQL"],
      role: "Coursework",
      timeline: "2025",
    },
    {
      name: "Zero-downtime schema migrator",
      description: "Expands and contracts Postgres migrations with a dual-write window, so a deploy never needs a maintenance mode.",
      tech: ["TypeScript", "PostgreSQL", "Node.js"],
      role: "Weekend project",
      timeline: "2024",
    },
  ],
  skills: [
    { name: "Go", group: "Languages" },
    { name: "TypeScript", group: "Languages" },
    { name: "Python", group: "Languages" },
    { name: "Java", group: "Languages" },
    { name: "PostgreSQL", group: "Data" },
    { name: "Redis", group: "Data" },
    { name: "Kafka", group: "Data" },
    { name: "Docker", group: "Platform" },
    { name: "Kubernetes", group: "Platform" },
    { name: "AWS", group: "Platform" },
  ],
  highlights: [
    "Accepted to the Google STEP internship programme, 2026",
    "Winner, national inter-college hackathon, 2025",
    "Top 5 percent, DBMS course, 2025",
  ],
  github: { username: "nainakumari" },
  meta: {
    handle: "nainakumari",
    templateId: "classic",
  },
}