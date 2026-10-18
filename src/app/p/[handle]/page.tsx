import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { portfolioQueries } from "@composition/portfolio-queries"
import { buildPersonJsonLd, renderTemplateFor } from "@application/portfolio/portfolio-queries"
import { findMeta } from "@presentation/templates/registry"
import { JsonLd } from "@presentation/seo/json-ld"

type PageProps = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
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