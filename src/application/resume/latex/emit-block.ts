import type {
  ResumeBlock,
  ResumeBulletStyle,
  ResumeEntryStyle,
  ResumeHeadingStyle,
  ResumeLayout,
  ResumeLayoutSpec,
  ResumeNameStyle,
} from "../resume-layout"
import type { ResumeMetrics } from "../resume-metrics"
import { escapeTex } from "./escape-tex"

const command = (name: string, args: string[]): string =>
  `\\${name}{${args.join("}{")}}`

const bulletMacros: Record<ResumeBulletStyle, string> = {
  dot: "rbulletdot",
  dash: "rbulletdash",
  none: "rbulletnone",
}

const entryMacros: Record<ResumeEntryStyle, string> = {
  split: "rentrysplit",
  inline: "rentryinline",
}

const nameMacros: Record<ResumeNameStyle, string> = {
  left: "rnameleft",
  centred: "rnamecentred",
  boxed: "rnamebox",
}

const headingMacro = (style: ResumeHeadingStyle, rule: boolean): string => {
  if (style === "rule") return rule ? "rsectionrule" : "rsectionnorule"
  return `rsection${style}`
}

const emit = (block: ResumeBlock, spec: ResumeLayoutSpec, metrics: ResumeMetrics): string | null => {
  switch (block.kind) {
    case "name":
      return command(nameMacros[spec.nameStyle], [String(metrics.nameSize), escapeTex(block.text)])
    case "contact": {
      const separator = spec.contactSeparator === "bar" ? " $\\vert$ " : " $\\cdot$ "
      return command("rcontact", [block.items.map(escapeTex).join(separator)])
    }
    case "note":
      return command(spec.headlineStyle === "bold" ? "rnotebold" : "rnote", [escapeTex(block.text)])
    case "heading":
      return command(headingMacro(block.style, metrics.headingRule), [
        String(metrics.sectionGap),
        command(spec.headingCaps ? "rcaps" : "rnocaps", [escapeTex(block.text)]),
      ])
    case "entry": {
      const trailing: string[] = []
      if (block.summary.length > 0) trailing.push(command("rtext", [escapeTex(block.summary)]))
      for (const bullet of block.bullets) {
        trailing.push(command(bulletMacros[metrics.bulletStyle], [escapeTex(bullet)]))
      }
      return command(entryMacros[block.style], [
        escapeTex(block.title),
        escapeTex(block.organisation),
        escapeTex(block.dates),
        escapeTex(block.meta),
        trailing.join(""),
        String(metrics.entryGap),
      ])
    }
    case "skills":
      return command("rskills", [
        block.groups
          .map((group) =>
            group.label.length === 0
              ? escapeTex(group.items.join(", "))
              : `${escapeTex(group.label)}: ${escapeTex(group.items.join(", "))}`,
          )
          .join("\\\\ "),
        String(metrics.entryGap),
      ])
  }
}

const bodyOf = (
  blocks: ResumeBlock[],
  spec: ResumeLayoutSpec,
  metrics: ResumeMetrics,
): string =>
  blocks
    .map((block) => emit(block, spec, metrics))
    .filter((line): line is string => line !== null)
    .join("\n")

export const emitLayout = (
  layout: ResumeLayout,
  spec: ResumeLayoutSpec,
  metrics: ResumeMetrics,
): string => {
  if (layout.railIndexes.length === 0) return bodyOf(layout.blocks, spec, metrics)

  const rail = new Set(layout.railIndexes)
  const railBlocks = layout.blocks.filter((_, index) => rail.has(index))
  const mainBlocks = layout.blocks.filter((_, index) => !rail.has(index))

  const railBody = spec.railTint
    ? command("rrailtint", [bodyOf(railBlocks, spec, metrics)])
    : bodyOf(railBlocks, spec, metrics)

  const railWidth = `${Math.round(spec.railWidth * 100)}%`
  const mainWidth = `${Math.round((1 - spec.railWidth) * 100) - 4}%`

  return [
    command("rrailopen", [railWidth, mainWidth, railBody]),
    bodyOf(mainBlocks, spec, metrics),
    "\\rrailclose",
  ].join("\n")
}