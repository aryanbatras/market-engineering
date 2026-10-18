import type { ComponentType } from "react"
import type { Portfolio, TemplateConfig } from "@application/portfolio/portfolio.schema"

export type TemplateCapabilities = {
  three: boolean
  gsap: boolean
  lenis: boolean
}

export type TemplateMeta = {
  id: string
  name: string
  summary: string
  forWhom: string
  dark: boolean
  supportedVersions: number[]
  capabilities: TemplateCapabilities
  accent: "blue" | "ink"
  featured: boolean
  freeTier: boolean
}

export type TemplateProps = {
  data: Portfolio
  config: TemplateConfig
  showAttribution: boolean
}

export type TemplateModule = {
  meta: TemplateMeta
  Template: ComponentType<TemplateProps>
}

export type TemplateDescriptor = {
  meta: TemplateMeta
  load: () => Promise<TemplateModule>
}