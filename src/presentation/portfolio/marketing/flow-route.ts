export type FlowSide = "top" | "bottom" | "left" | "right" | "middle" | "pass"

export type FlowStop =
  | { kind: "anchor"; name: string; side: FlowSide }
  | { kind: "trunk"; name: string; caption?: string }

export type FlowPort = { x: number; y: number }

export const flowStops: FlowStop[] = [
  { kind: "anchor", name: "start", side: "bottom" },
  { kind: "trunk", name: "hero", caption: "Your YAML becomes the page" },
  { kind: "anchor", name: "parser", side: "top" },
  { kind: "anchor", name: "render", side: "top" },
  { kind: "anchor", name: "work", side: "top" },
  { kind: "anchor", name: "page", side: "top" },
  { kind: "anchor", name: "link", side: "top" },
  { kind: "anchor", name: "end", side: "top" },
  { kind: "anchor", name: "resume", side: "left" },
]

export const flowLead = 30
export const flowCorner = 20
export const flowCaptionLift = 34

export const oppositeSide = (side: FlowSide): FlowSide => {
  if (side === "middle") return "middle"
  if (side === "top") return "bottom"
  if (side === "bottom") return "top"
  if (side === "left") return "right"
  return "left"
}

export const trunkPort = (centre: number, y: number): FlowPort => ({ x: centre, y })

export const anchorPort = (
  rect: { top: number; bottom: number; left: number; right: number; centreX: number; centreY: number },
  side: FlowSide,
): FlowPort => {
  if (side === "top") return { x: rect.centreX, y: rect.top }
  if (side === "bottom") return { x: rect.centreX, y: rect.bottom }
  if (side === "left") return { x: rect.left, y: rect.centreY }
  if (side === "middle") return { x: rect.centreX, y: rect.centreY }
  return { x: rect.right, y: rect.centreY }
}

export const exitPort = (port: FlowPort, side: FlowSide): FlowPort => {
  if (side === "middle" || side === "pass") return port
  if (side === "top") return { x: port.x, y: port.y - flowLead }
  if (side === "bottom") return { x: port.x, y: port.y + flowLead }
  if (side === "left") return { x: port.x - flowLead, y: port.y }
  return { x: port.x + flowLead, y: port.y }
}

export const entryPort = (port: FlowPort, side: FlowSide): FlowPort => {
  if (side === "middle" || side === "pass") return port
  if (side === "top") return { x: port.x, y: port.y - flowLead }
  if (side === "bottom") return { x: port.x, y: port.y + flowLead }
  if (side === "left") return { x: port.x - flowLead, y: port.y }
  return { x: port.x + flowLead, y: port.y }
}