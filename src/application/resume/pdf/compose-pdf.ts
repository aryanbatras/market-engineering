import type { ResumeBulletStyle, ResumeLayout, ResumeLayoutSpec, ResumeSkin } from "../resume-layout"
import type { ResumeMetrics } from "../resume-metrics"
import { escapePdfString, toWinAnsi } from "./pdf-encode"
import { textWidth, wrapText, type PdfFontName } from "./pdf-metrics"

export type PdfRun = {
  text: string
  size: number
  font: PdfFontName
  indent: number
  gapBefore: number
  rule: boolean
  hang?: boolean
  centre?: boolean
  marker?: string
}

const a4Width = 595
const a4Height = 842
const lineGap = 3
const pointsPerCm = 28.35

const bulletPrefix = (style: ResumeBulletStyle): string => {
  if (style === "dot") return "• "
  if (style === "dash") return "- "
  return ""
}

const pageGeometry = (metrics: ResumeMetrics) => {
  const margin = metrics.pageMargin * pointsPerCm
  return { margin, contentWidth: a4Width - margin * 2, top: a4Height - margin, bottom: margin }
}

const runsFor = (
  layout: ResumeLayout,
  spec: ResumeLayoutSpec,
  metrics: ResumeMetrics,
): PdfRun[] => {
  const base = metrics.bodySize
  const exToPoints = (ex: number) => ex * base * 0.45
  const runs: PdfRun[] = []
  const centred = spec.headerAlign === "centred"
  const entryInline = spec.entryStyle === "inline"

  for (const block of layout.blocks) {
    switch (block.kind) {
      case "name":
        runs.push({
          text: block.text,
          size: metrics.nameSize,
          font: "bold",
          indent: 0,
          gapBefore: 0,
          rule: false,
          centre: centred,
        })
        break
      case "note":
        runs.push({
          text: block.text,
          size: base,
          font: spec.headlineStyle === "bold" ? "bold" : "regular",
          indent: 0,
          gapBefore: 2,
          rule: false,
          centre: centred,
        })
        break
      case "contact":
        runs.push({
          text: block.items.join(spec.contactSeparator === "bar" ? "  |  " : "  \u00b7  "),
          size: base - 0.5,
          font: "regular",
          indent: 0,
          gapBefore: 4,
          rule: false,
          centre: centred,
        })
        break
      case "heading":
        runs.push({
          text: spec.headingCaps ? block.text.toUpperCase() : block.text,
          size: spec.headingCaps ? base + 1 : base + 1.5,
          font: "bold",
          indent: 0,
          gapBefore: exToPoints(metrics.sectionGap),
          rule: block.style === "rule" && metrics.headingRule,
          marker: block.style === "caret" ? "• " : undefined,
        })
        break
      case "entry": {
        const head = [block.title, block.organisation].filter(Boolean).join(", ")
        const headText = entryInline && block.dates.length > 0 ? `${head}  |  ${block.dates}` : head
        runs.push({
          text: headText,
          size: base + 0.5,
          font: "bold",
          indent: 0,
          gapBefore: exToPoints(metrics.entryGap) * 1.6,
          rule: false,
        })
        if (!entryInline && block.dates.length > 0) {
          runs.push({
            text: block.dates,
            size: base - 0.5,
            font: "regular",
            indent: 0,
            gapBefore: 0,
            rule: false,
            hang: true,
          })
        }
        if (block.meta.length > 0) {
          runs.push({
            text: block.meta,
            size: base - 0.5,
            font: "regular",
            indent: 0,
            gapBefore: 2,
            rule: false,
          })
        }
        if (block.summary.length > 0) {
          runs.push({
            text: block.summary,
            size: base,
            font: "regular",
            indent: 0,
            gapBefore: 2,
            rule: false,
          })
        }
        for (const bullet of block.bullets) {
          runs.push({
            text: `${bulletPrefix(metrics.bulletStyle)}${bullet}`,
            size: base,
            font: "regular",
            indent: metrics.bulletStyle === "none" ? 0 : 10,
            gapBefore: 1,
            rule: false,
          })
        }
        break
      }
      case "skills":
        for (const group of block.groups) {
          const label = group.label.length > 0 ? `${group.label}: ` : ""
          runs.push({
            text: `${label}${group.items.join(", ")}`,
            size: base,
            font: group.label.length > 0 ? "bold" : "regular",
            indent: 0,
            gapBefore: 2,
            rule: false,
          })
        }
        break
    }
  }

  if (spec.headerRule) {
    runs.push({
      text: "",
      size: 0.5,
      font: "regular",
      indent: 0,
      gapBefore: exToPoints(metrics.sectionGap),
      rule: true,
    })
  }

  return runs
}

type PlacedLine = {
  text: string
  size: number
  font: PdfFontName
  x: number
  y: number
  rule: boolean
  ruleWidth: number
}

const place = (
  layout: ResumeLayout,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): { pages: PlacedLine[][]; geometry: ReturnType<typeof pageGeometry> } => {
  const geometry = pageGeometry(skin.metrics)
  const pages: PlacedLine[][] = []
  let current: PlacedLine[] = []
  let y = geometry.top
  let hang: PdfRun | null = null

  const newPage = () => {
    pages.push(current)
    current = []
    y = geometry.top
  }

  for (const run of runsFor(layout, spec, skin.metrics)) {
    const text = run.marker === undefined ? run.text : `${run.marker}${run.text}`

    if (run.hang === true && hang !== null) {
      const width = textWidth(text, run.size, run.font)
      current.push({
        text,
        size: run.size,
        font: run.font,
        x: geometry.margin + geometry.contentWidth - width,
        y,
        rule: false,
        ruleWidth: geometry.contentWidth,
      })
      continue
    }

    const available = geometry.contentWidth - run.indent
    const lines = wrapText(text, run.size, run.font, available)

    y -= run.gapBefore
    hang = null

    lines.forEach((line, index) => {
      const advance = run.size * (index === 0 ? 1.34 : 1.22)
      if (y - advance < geometry.bottom) newPage()
      y -= advance
      const width = textWidth(line, run.size, run.font)
      current.push({
        text: line,
        size: run.size,
        font: run.font,
        x:
          run.centre === true
            ? geometry.margin + (geometry.contentWidth - width) / 2
            : geometry.margin + run.indent,
        y,
        rule: false,
        ruleWidth: geometry.contentWidth,
      })
      if (index === 0) hang = run
    })

    if (run.rule) {
      y -= run.size * 0.5
      current.push({
        text: "",
        size: 0.5,
        font: "regular",
        x: geometry.margin,
        y,
        rule: true,
        ruleWidth: geometry.contentWidth,
      })
      y -= lineGap
      hang = null
    } else {
      y -= 1
    }
  }

  pages.push(current)
  return { pages: pages.filter((page) => page.length > 0), geometry }
}

const contentStream = (lines: PlacedLine[]): string => {
  const parts: string[] = ["BT"]
  let currentFont = ""

  for (const line of lines) {
    if (line.rule) {
      parts.push("ET")
      parts.push("0.4 w")
      parts.push("0.5 0.5 0.5 RG")
      parts.push(`${line.x} ${line.y} m ${line.x + line.ruleWidth} ${line.y} l S`)
      parts.push("BT")
      currentFont = ""
      continue
    }
    if (line.text.length === 0) continue
    const font = line.font === "bold" ? "F2" : "F1"
    if (font !== currentFont) {
      parts.push(`/${font} ${line.size.toFixed(2)} Tf`)
      currentFont = font
    }
    parts.push(`1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(2)} Tm`)
    parts.push(`(${escapePdfString(line.text)}) Tj`)
  }

  parts.push("ET")
  return parts.join("\n")
}

const documentObjects = (pages: PlacedLine[][]): string[] => {
  const objects: string[] = []
  const firstPageId = 5
  const pageIds = pages.map((_, index) => firstPageId + index * 2)
  const contentIds = pages.map((_, index) => firstPageId + 1 + index * 2)
  const kids = pageIds.map((id) => `${id} 0 R`).join(" ")

  objects.push("<</Type/Catalog/Pages 2 0 R>>")
  objects.push(`<</Type/Pages/Kids[${kids}]/Count ${pages.length}>>`)
  objects.push("<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>")
  objects.push("<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>")

  pages.forEach((lines, index) => {
    const stream = contentStream(lines)
    const dict = [
      "<</Type/Page/Parent 2 0 R",
      `/MediaBox[0 0 ${a4Width} ${a4Height}]`,
      `/Contents ${contentIds[index]} 0 R`,
      "/Resources<</Font<</F1 3 0 R/F2 4 0 R>>",
      ">>>>",
    ].join(" ")
    objects.push(dict)
    objects.push(`<</Length ${stream.length}>>\nstream\n${stream}\nendstream`)
  })

  return objects
}

export const composePdf = (
  layout: ResumeLayout,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): Uint8Array<ArrayBuffer> => {
  const { pages } = place(layout, spec, skin)
  const objects = documentObjects(pages.length > 0 ? pages : [[]])

  let pdf = "%PDF-1.7\n"
  const offsets: number[] = []

  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${toWinAnsi(object)}\nendobj\n`
  })

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`
  }
  pdf += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`

  const bytes = new Uint8Array(new ArrayBuffer(pdf.length))
  for (let index = 0; index < pdf.length; index += 1) bytes[index] = pdf.charCodeAt(index) & 0xff
  return bytes
}

export const estimatePageCount = (
  layout: ResumeLayout,
  spec: ResumeLayoutSpec,
  skin: ResumeSkin,
): number => place(layout, spec, skin).pages.length