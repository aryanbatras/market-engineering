import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { portfolioQueries } from "@composition/portfolio/portfolio-queries"
import { buildPersonJsonLd, renderTemplateFor } from "@application/portfolio/portfolio-queries"
import { isMockEnvironment } from "@application/core/site/app-environment"
import { siteConfig } from "@application/core/site/site-config"
import { findMeta } from "@presentation/portfolio/templates/registry"
import { JsonLd } from "@presentation/core/seo/json-ld"
import { ClientPortfolioView } from "@presentation/portfolio/templates/portfolio-view"

type PageProps = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params

  if (isMockEnvironment()) {
    return {
      title: `Portfolio · ${siteConfig.name}`,
      robots: { index: false, follow: false },
    }
  }

  const record = await portfolioQueries.getPublishedPortfolio(handle)
  if (!record) return { title: "Portfolio not found", robots: { index: false, follow: false } }

  const name = record.data.identity.name

  return {
    title: record.data.identity.headline ? `${name} — ${record.data.identity.headline}` : name,
    description:
      record.data.identity.headline ??
      `The portfolio of ${name}: projects, experience, and what they can build.`,
    alternates: { canonical: `/p/${record.handle}` },
    openGraph: {
      type: "profile",
      title: name,
      description: record.data.identity.headline ?? "",
      images: [{ url: `/api/og/${record.handle}`, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      images: [`/api/og/${record.handle}`],
    },
  }
}

const PortfolioPage = async ({ params }: PageProps) => {
  const { handle } = await params

  if (isMockEnvironment()) return <ClientPortfolioView handle={handle} />

  const record = await portfolioQueries.getPublishedPortfolio(handle)
  if (!record) notFound()

  const template = await renderTemplateFor(record.templateId)
  if (!template) notFound()

  const isFreeTier = findMeta(record.templateId)?.freeTier ?? true

  return (
    <>
      <JsonLd data={buildPersonJsonLd(record)} />
      <template.Template config={record.config} data={record.data} showAttribution={isFreeTier} />
    </>
  )
}

export default PortfolioPage
