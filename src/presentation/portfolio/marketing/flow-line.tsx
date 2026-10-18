"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePrefersReducedMotion } from "@presentation/core/design/use-prefers-reduced-motion"
import { polylineToPath, routeBetween } from "./flow-path"
import { flowLineStyles } from "./flow-line.styles"
import { anchorPort, flowCaptionLift, flowStops, trunkPort, type FlowPort, type FlowSide } from "./flow-route"

type FlowSegment = { d: string; fromY: number; toY: number }

type Geometry = {
  segments: FlowSegment[]
  caption: { x: number; y: number; text: string } | null
}

const blank: Geometry = { segments: [], caption: null }

const measureRoute = (): Geometry => {
  const viewport = document.documentElement.clientWidth
  const centre = viewport / 2
  const segments: FlowSegment[] = []
  let caption: Geometry["caption"] = null

  let previousPort: FlowPort | null = null
  let previousSide: FlowSide = "pass"
  let previousY = 0

  for (const stop of flowStops) {
    let port: FlowPort
    const entrySide: FlowSide = stop.kind === "trunk" ? "pass" : stop.side

    if (stop.kind === "trunk") {
      const node = document.querySelector<HTMLElement>(`[data-flow-trunk="${stop.name}"]`)
      if (!node) continue
      port = trunkPort(centre, node.getBoundingClientRect().bottom + window.scrollY)
    } else {
      const node = document.querySelector<HTMLElement>(`[data-flow="${stop.name}"]`)
      if (!node) continue
      const box = node.getBoundingClientRect()
      port = anchorPort(
        {
          top: box.top + window.scrollY,
          bottom: box.bottom + window.scrollY,
          left: box.left,
          right: box.right,
          centreX: box.left + box.width / 2,
          centreY: box.top + window.scrollY + box.height / 2,
        },
        stop.side,
      )
    }

    if (previousPort) {
      segments.push({
        d: polylineToPath([previousPort, ...routeBetween(previousPort, previousSide, port, entrySide), port]),
        fromY: previousY,
        toY: port.y,
      })
    }

    if (stop.kind === "trunk" && stop.caption && caption === null && viewport >= 1024) {
      caption = { x: centre + 20, y: port.y - flowCaptionLift, text: stop.caption }
    }

    previousPort = port
    previousSide = entrySide
    previousY = port.y
  }

  return { segments, caption }
}

export const FlowLine = () => {
  const group = useRef<SVGGElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const [geometry, setGeometry] = useState<Geometry>(blank)

  useEffect(() => {
    const rebuild = () => setGeometry(measureRoute())

    rebuild()

    const observer = new ResizeObserver(rebuild)
    observer.observe(document.documentElement)

    const settle = window.setTimeout(rebuild, 300)
    const late = window.setTimeout(rebuild, 1400)

    return () => {
      observer.disconnect()
      window.clearTimeout(settle)
      window.clearTimeout(late)
    }
  }, [])

  const strokes = useMemo(
    () => geometry.segments.map((segment) => <path className={flowLineStyles.trunk} d={segment.d} key={segment.d} pathLength={1} />),
    [geometry.segments],
  )

  useEffect(() => {
    const node = group.current
    if (!node) return

    const paths = Array.from(node.querySelectorAll("path"))
    if (paths.length === 0) return

    const paint = () => {
      const lead = window.innerHeight * 0.55
      paths.forEach((path, index) => {
        const segment = geometry.segments[index]
        if (!segment) return
        if (reduced) {
          path.style.strokeDashoffset = "0"
          return
        }
        const span = Math.max(1, segment.toY - segment.fromY)
        const travelled = (window.scrollY + lead - segment.fromY) / span
        path.style.strokeDashoffset = `${1 - Math.min(1, Math.max(0, travelled))}`
      })
    }

    paths.forEach((path) => {
      path.style.strokeDasharray = "1"
    })
    paint()

    window.addEventListener("scroll", paint, { passive: true })
    window.addEventListener("resize", paint)
    return () => {
      window.removeEventListener("scroll", paint)
      window.removeEventListener("resize", paint)
    }
  }, [geometry.segments, reduced])

  if (geometry.segments.length === 0) return null

  return (
    <div aria-hidden className={flowLineStyles.layer}>
      <svg className={flowLineStyles.canvas} height="100%" preserveAspectRatio="none" width="100%">
        <g ref={group}>{strokes}</g>
        {geometry.caption ? (
          <text
            className={flowLineStyles.caption}
            dominantBaseline="middle"
            x={geometry.caption.x}
            y={geometry.caption.y}
          >
            {geometry.caption.text}
          </text>
        ) : null}
      </svg>
    </div>
  )
}