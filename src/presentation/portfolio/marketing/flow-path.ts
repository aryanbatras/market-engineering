import type { FlowPort, FlowSide } from "./flow-route"
import { entryPort, exitPort, flowCorner } from "./flow-route"

export const routeBetween = (
  from: FlowPort,
  fromSide: FlowSide,
  to: FlowPort,
  toSide: FlowSide,
): FlowPort[] => {
  const out = exitPort(from, fromSide)
  const entry = entryPort(to, toSide)
  const elbowY = Math.max(out.y, entry.y)

  return [out, { x: out.x, y: elbowY }, { x: entry.x, y: elbowY }, entry]
}

export const dedupe = (points: FlowPort[]): FlowPort[] =>
  points.filter(
    (point, index) =>
      index === 0 || Math.abs(point.x - points[index - 1]!.x) > 0.5 || Math.abs(point.y - points[index - 1]!.y) > 0.5,
  )

export const polylineToPath = (points: FlowPort[]): string => {
  const clean = dedupe(points)
  const first = clean[0]
  if (!first) return ""

  let path = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`

  for (let index = 1; index < clean.length; index += 1) {
    const previous = clean[index - 1]!
    const current = clean[index]!
    const before = clean[index - 2]

    if (!before) {
      path += ` L ${current.x.toFixed(1)} ${current.y.toFixed(1)}`
      continue
    }

    const radius = Math.min(
      flowCorner,
      Math.abs(current.x - previous.x) / 2,
      Math.abs(current.y - previous.y) / 2,
    )

    if (radius < 1) {
      path += ` L ${current.x.toFixed(1)} ${current.y.toFixed(1)}`
      continue
    }

    const entryX = current.x - Math.sign(current.x - previous.x) * radius
    const entryY = current.y - Math.sign(current.y - previous.y) * radius
    const exitX = previous.x + Math.sign(current.x - previous.x) * radius
    const exitY = previous.y + Math.sign(current.y - previous.y) * radius

    path += ` L ${entryX.toFixed(1)} ${entryY.toFixed(1)}`
    path += ` Q ${current.x.toFixed(1)} ${current.y.toFixed(1)} ${exitX.toFixed(1)} ${exitY.toFixed(1)}`
  }

  return path
}