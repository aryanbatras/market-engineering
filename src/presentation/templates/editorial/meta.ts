import type { TemplateMeta } from "../types"

export const meta: TemplateMeta = {
  id: "editorial",
  name: "Editorial",
  summary: "A fixed rail beside a long read.",
  forWhom: "For engineers with a point of view and enough to write about it.",
  dark: false,
  supportedVersions: [1],
  capabilities: { three: false, gsap: false, lenis: false },
  accent: "blue",
  featured: true,
  freeTier: true,
}
