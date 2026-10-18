import type { TemplateMeta } from "../types"

export const meta: TemplateMeta = {
  id: "bento",
  name: "Bento",
  summary: "An asymmetric grid, with projects given the largest tiles.",
  forWhom: "For engineers with several projects and no single one worth a whole page.",
  dark: false,
  supportedVersions: [1],
  capabilities: { three: false, gsap: false, lenis: false },
  accent: "blue",
  featured: true,
  freeTier: true,
}
