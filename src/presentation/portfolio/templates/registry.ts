import type { TemplateDescriptor } from "./types"
import { meta as classicMeta } from "./classic/meta"
import { meta as bentoMeta } from "./bento/meta"
import { meta as editorialMeta } from "./editorial/meta"
import { meta as minimalMeta } from "./minimal/meta"
import { meta as immersiveMeta } from "./immersive/meta"

export const registry: TemplateDescriptor[] = [
  { meta: classicMeta, load: async () => await import("./classic") },
  { meta: bentoMeta, load: async () => await import("./bento") },
  { meta: editorialMeta, load: async () => await import("./editorial") },
  { meta: minimalMeta, load: async () => await import("./minimal") },
  { meta: immersiveMeta, load: async () => await import("./immersive") },
]

export const templateIds = registry.map((entry) => entry.meta.id)

export const freeTemplateIds = registry.filter((entry) => entry.meta.freeTier).map((entry) => entry.meta.id)

export const findMeta = (id: string) => registry.find((entry) => entry.meta.id === id)?.meta ?? null

export const loadTemplate = async (id: string) => {
  const descriptor = registry.find((entry) => entry.meta.id === id)
  if (!descriptor) return null
  return await descriptor.load()
}