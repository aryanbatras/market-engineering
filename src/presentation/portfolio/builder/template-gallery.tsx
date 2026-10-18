"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LuArrowUpRight } from "react-icons/lu"
import { registry } from "@presentation/portfolio/templates/registry"
import type { TemplateMeta, TemplateModule } from "@presentation/portfolio/templates/types"
import { previewPortfolio } from "@application/portfolio/preview-portfolio"
import { cn } from "@presentation/core/design/cn"
import { templateCardStyles } from "./template-card.styles"

const previewConfig = { accent: "blue", density: "comfortable", dark: false } as const

type LivePreviewProps = {
  meta: TemplateMeta
  fill?: boolean
}

export const LiveTemplatePreview = ({ meta, fill = false }: LivePreviewProps) => {
  const [Component, setComponent] = useState<TemplateModule["Template"] | null>(null)

  useEffect(() => {
    let mounted = true
    void registry
      .find((entry) => entry.meta.id === meta.id)
      ?.load()
      .then((module) => {
        if (mounted) setComponent(() => module.Template)
      })
    return () => {
      mounted = false
    }
  }, [meta.id])

  return (
    <div
      className={cn(templateCardStyles.frame, fill && templateCardStyles.frameFill)}
      data-template={meta.id}
    >
      {Component ? (
        <div className={templateCardStyles.stage}>
          <div className={cn(templateCardStyles.canvas, meta.dark && templateCardStyles.canvasDark)}>
            <Component config={previewConfig} data={previewPortfolio} showAttribution={false} />
          </div>
        </div>
      ) : (
        <div className={templateCardStyles.loading} />
      )}
    </div>
  )
}

type TemplateCardProps = {
  meta: TemplateMeta
  active?: boolean
}

export const TemplateCard = ({ meta, active = false }: TemplateCardProps) => (
  <div className={cn(templateCardStyles.card, active && templateCardStyles.cardActive)}>
    <div className={templateCardStyles.head}>
      <span className={templateCardStyles.name}>{meta.name}</span>
      <span className={meta.freeTier ? templateCardStyles.tag : templateCardStyles.tagPro}>
        {meta.freeTier ? "Free" : "Pro"}
      </span>
    </div>
    <p className={templateCardStyles.forWhom}>{meta.forWhom}</p>
    <LiveTemplatePreview meta={meta} />
  </div>
)

type TemplateGalleryProps = {
  limit?: number
  heading?: string
}

export const TemplateGallery = ({ limit, heading }: TemplateGalleryProps) => {
  const shown = typeof limit === "number" ? registry.slice(0, limit) : registry
  const capped = typeof limit === "number" && shown.length < registry.length

  return (
    <div>
      {heading ? <h2 className={templateCardStyles.heading}>{heading}</h2> : null}
      <div className={templateCardStyles.grid}>
        {shown.map((entry) => (
          <TemplateCard key={entry.meta.id} meta={entry.meta} />
        ))}

        {capped ? (
          <Link className={templateCardStyles.viewMore} href="/templates">
            <span className={templateCardStyles.viewMoreText}>See all templates</span>
            <LuArrowUpRight aria-hidden size={20} strokeWidth={1.5} />
          </Link>
        ) : null}
      </div>
    </div>
  )
}