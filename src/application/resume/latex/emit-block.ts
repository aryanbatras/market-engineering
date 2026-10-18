import type { ResumeBlock } from "../resume-layout"
import { escapeTex } from "./escape-tex"

const command = (name: string, args: string[]): string =>
  `\\${name}{${args.join("}{")}}`

const entryTrailing = (block: Extract<ResumeBlock, { kind: "entry" }>): string => {
  const parts: string[] = []
  if (block.summary.length > 0) parts.push(command("rtext", [escapeTex(block.summary)]))
  for (const bullet of block.bullets) parts.push(command("rbullet", [escapeTex(bullet)]))
  return parts.join("")
}

const entryArgs = (block: Extract<ResumeBlock, { kind: "entry" }>): string[] => [
  escapeTex(block.title),
  escapeTex(block.organisation),
  escapeTex(block.dates),
  escapeTex(block.meta),
  entryTrailing(block),
]

const skillLines = (block: Extract<ResumeBlock, { kind: "skills" }>): string[] =>
  block.groups.map((group) =>
    group.label.length === 0
      ? escapeTex(group.items.join(", "))
      : `${escapeTex(group.label)}: ${escapeTex(group.items.join(", "))}`,
  )

export const emitBlock = (block: ResumeBlock): string | null => {
  switch (block.kind) {
    case "name":
      return command("rname", [escapeTex(block.text)])
    case "contact":
      return command("rcontact", [block.items.map(escapeTex).join(" $\\vert$ ")])
    case "note":
      return command("rnote", [escapeTex(block.text)])
    case "heading":
      return command(block.rule ? "rsectionrule" : "rsection", [escapeTex(block.text)])
    case "entry":
      return command("rentry", entryArgs(block))
    case "skills":
      return command("rskills", [skillLines(block).join("\\\\ ")])
  }
}