import type { TemplateMeta } from "../types"

export const meta: TemplateMeta = {
  id: "immersive",
  name: "Immersive",
  summary: "A dark, layered page that moves as you scroll.",
  forWhom: "For engineers who want the work to arrive with some force behind it.",
  dark: true,
  supportedVersions: [1],
  capabilities: { three: false, gsap: true, lenis: true },
  accent: "blue",
  featured: true,
  freeTier: false,
}
