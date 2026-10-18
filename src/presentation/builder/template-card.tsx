"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { registry } from "@presentation/templates/registry"
import type { TemplateMeta } from "@presentation/templates/types"
import { cn } from "@presentation/design/cn"
import { previewPortfolio } from "@application/portfolio/preview-portfolio"
import { templateCardStyles } from "./template-card.styles"

type TemplateCardProps = {
  meta: TemplateMeta
  active?: boolean
  onSelect?: (id: string) => void
}

const previewData = previewPortfolio
const previewConfig = { accent: "blue", density: "comfortable", dark: false } as const

export const TemplateCard = ({ meta, active = false, onSelect }: TemplateCardProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [Component, setComponent] = useState<((props: {
    data: typeof previewData
    config: typeof previewConfig
    showAttribution: boolean
  }) => ReactNode) | null>(null)

  useEffect(() => {
    let mounted = true
    const descriptor = registry.find((entry) => entry.meta.id === meta.id)
    if (!descriptor) return
    void descriptor.load().then((module) => {
      if (!mounted) return
      setComponent(() => module.Template as never)
    })
    return () => {
      mounted = false
    }
  }, [meta.id])

  const Wrapper = onSelect ? "button" : "div"

  return (
    <Wrapper
      className={cn(templateCardStyles.card, active && templateCardStyles.cardActive)}
      onClick={onSelect ? () => onSelect(meta.id) : undefined}
      ref={hostRef as never}
      type={onSelect ? "button" : undefined}
    >
      <div className={templateCardStyles.head}>
        <span className={templateCardStyles.name}>{meta.name}</span>
        <span className={meta.freeTier ? templateCardStyles.tag : templateCardStyles.tagPro}>
          {meta.freeTier ? "Free" : "Pro"}
        </span>
      </div>
      <p className={templateCardStyles.forWhom}>{meta.forWhom}</p>
      <div className={templateCardStyles.frame}>
        {Component ? (
          <div className={cn(templateCardStyles.scale, meta.dark && templateCardStyles.scaleDark)}>
            <Component config={previewConfig} data={previewData} showAttribution={false} />
          </div>
        ) : (
          <div className={templateCardStyles.loading} />
        )}
      </div>
    </Wrapper>
  )
}