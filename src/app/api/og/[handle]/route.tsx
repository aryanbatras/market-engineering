import { ImageResponse } from "next/og"
import { isMockEnvironment } from "@application/core/site/app-environment"
import { siteConfig } from "@application/core/site/site-config"

export const runtime = "edge"

type RouteProps = {
  params: Promise<{ handle: string }>
}

const getLiveRecord = async (handle: string) => {
  const { portfolioQueries } = await import("@composition/portfolio/portfolio-queries")
  return await portfolioQueries.getPublishedPortfolio(handle)
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { handle } = await params
  const record = isMockEnvironment() ? null : await getLiveRecord(handle)

  const name = record?.data.identity.name ?? "Your portfolio"
  const headline = record?.data.identity.headline ?? "Publish it in ten minutes"
  const projects = record?.data.projects.length ?? 0
  const experience = record?.data.experience.length ?? 0

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background: "#ffffff",
          color: "#0a0a0b",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", fontSize: 20, letterSpacing: "-0.01em" }}>
          {siteConfig.origin.replace(/^https?:\/\//, "")}/p/{handle}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1 }}>
            {name}
          </div>
          <div style={{ color: "#5f6068", display: "flex", fontSize: 34, marginTop: 18 }}>
            {headline}
          </div>
        </div>
        <div style={{ color: "#8e8f98", display: "flex", fontSize: 22, gap: 14 }}>
          <span>{projects} projects</span>
          <span>{experience === 1 ? "1 role" : `${experience} roles`}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
