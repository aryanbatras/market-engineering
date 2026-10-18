"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { LuArrowUpRight } from "react-icons/lu"
import { registry } from "@presentation/templates/registry"
import type { TemplateMeta, TemplateModule } from "@presentation/templates/types"
import { previewPortfolio } from "@application/portfolio/preview-portfolio"
import { cn } from "@presentation/design/cn"
import { templateCardStyles } from "./template-card.styles"

type TemplateCardProps = {
  meta: TemplateMeta
  active?: boolean
}

const previewConfig = { accent: "blue", density: "comfortable", dark: false } as const

export const TemplateCard = ({ meta, active = false }: TemplateCardProps) => {
  const [Component, setComponent] = useState<TemplateModule["Template"] | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true
    const descriptor = registry.find((entry) => entry.meta.id === meta.id)
    if (!descriptor) return
    void descriptor.load().then((module) => {
      if (mounted) setComponent(() => module.Template)
    })
    return () => {
      mounted = false
    }
  }, [meta.id])

  return (
    <div className={cn(templateCardStyles.card, active && templateCardStyles.cardActive)}>
      <div className={templateCardStyles.head}>
        <span className={templateCardStyles.name}>{meta.name}</span>
        <span className={meta.freeTier ? templateCardStyles.tag : templateCardStyles.tagPro}>
          {meta.freeTier ? "Free" : "Pro"}
        </span>
      </div>

      <p className={templateCardStyles.forWhom}>{meta.forWhom}</p>

      <div className={templateCardStyles.frame} ref={frameRef}>
        {Component ? (
          <div className={cn(templateCardStyles.scale, meta.dark && templateCardStyles.scaleDark)}>
            <Component config={previewConfig} data={previewPortfolio} showAttribution={false} />
          </div>
        ) : (
          <div className={templateCardStyles.loading} />
        )}
      </div>

      <div className={templateCardStyles.live}>
        <Link className={templateCardStyles.liveLink} href={`/p/yourname?template=${meta.id}`}>
          See it live
          <LuArrowUpRight size={15} strokeWidth={1.5} />
        </Link>
        <span className={templateCardStyles.liveNote}>{meta.summary}</span>
      </div>
    </div>
  )
}