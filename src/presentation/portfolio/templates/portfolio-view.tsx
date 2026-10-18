"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { portfolioRepository } from "@infrastructure/portfolio/persistence/resolve-portfolio-repository"
import { buildPersonJsonLd } from "@application/portfolio/portfolio-queries"
import { isMockEnvironment } from "@application/core/site/app-environment"
import type { PublishedPortfolio } from "@application/portfolio/portfolio.schema"
import type { TemplateModule } from "@presentation/portfolio/templates/types"
import { findMeta } from "@presentation/portfolio/templates/registry"
import { JsonLd } from "@presentation/core/seo/json-ld"
import { Button } from "@presentation/core/design/button"
import { viewStyles } from "./portfolio-view.styles"

const useResolvedPortfolio = (handle: string) => {
  const [record, setRecord] = useState<PublishedPortfolio | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void portfolioRepository
      .findByHandle(handle)
      .then((found) => {
        if (active) setRecord(found)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [handle])

  return { record, loading }
}

const TemplateHost = ({
  templateId,
  record,
}: {
  templateId: string
  record: PublishedPortfolio
}) => {
  const [Component, setComponent] = useState<TemplateModule["Template"] | null>(null)

  useEffect(() => {
    let active = true
    void import("@presentation/portfolio/templates/registry").then(({ loadTemplate }) =>
      loadTemplate(templateId).then((module) => {
        if (active && module) setComponent(() => module.Template)
      }),
    )
    return () => {
      active = false
    }
  }, [templateId])

  if (!Component) return <div className={viewStyles.loading} />
  return <Component config={record.config} data={record.data} showAttribution={isFreeTier(templateId)} />
}

const isFreeTier = (templateId: string) => findMeta(templateId)?.freeTier ?? true

const PortfolioView = ({ handle }: { handle: string }) => {
  const { record, loading } = useResolvedPortfolio(handle)

  useEffect(() => {
    if (!record) return
    document.title = record.data.identity.headline
      ? `${record.data.identity.name} — ${record.data.identity.headline}`
      : record.data.identity.name
  }, [record])

  if (loading) return <div className={viewStyles.loading}>Loading…</div>
  if (!record) return <NotFound handle={handle} />
  if (record.data.identity.name.length === 0) return <NotFound handle={handle} />

  return (
    <>
      <JsonLd data={buildPersonJsonLd(record)} />
      <TemplateHost record={record} templateId={record.templateId} />
    </>
  )
}

const NotFound = ({ handle }: { handle: string }) => (
  <div className={viewStyles.notFoundRoot}>
    <div className={viewStyles.notFoundInner}>
      <h1 className={viewStyles.notFoundTitle}>Nobody has claimed this one yet</h1>
      <p className={viewStyles.notFoundBody}>
        There is no published portfolio at /{handle} in this browser. If you just signed in and published
        something, it may be signed out.
      </p>
      <div className={viewStyles.notFoundActions}>
        <Link href="/builder">
          <Button intent="primary">Build yours</Button>
        </Link>
        <Link className={viewStyles.link} href="/">
          Back to the start
        </Link>
      </div>
    </div>
  </div>
)

export const ClientPortfolioView = PortfolioView