import type { TemplateMeta } from "../types"

export const meta: TemplateMeta = {
  id: "classic",
  name: "Classic",
  summary: "One column, straight down, no surprises.",
  forWhom: "For engineers whose work should speak plainly, with nothing competing for attention.",
  dark: false,
  supportedVersions: [1],
  capabilities: { three: false, gsap: false, lenis: false },
  accent: "blue",
  featured: false,
  freeTier: true,
}
