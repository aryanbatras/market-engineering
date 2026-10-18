import { ImageResponse } from "next/og"
import { portfolioQueries } from "@composition/portfolio-queries"

export const runtime = "edge"

type RouteProps = {
  params: Promise<{ handle: string }>
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { handle } = await params
  const record = await portfolioQueries.getPublishedPortfolio(handle)

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
          marketengineering.dev/p/{handle}
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
