import type { TemplateMeta } from "../types"

export const meta: TemplateMeta = {
  id: "minimal",
  name: "Minimal",
  summary: "Almost nothing on the page, set very large.",
  forWhom: "For engineers who would rather the work be noticed than the design.",
  dark: false,
  supportedVersions: [1],
  capabilities: { three: false, gsap: false, lenis: false },
  accent: "ink",
  featured: true,
  freeTier: true,
}
