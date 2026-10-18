const specials: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  $: "\\$",
  "&": "\\&",
  "#": "\\#",
  "^": "\\textasciicircum{}",
  _: "\\_",
  "~": "\\textasciitilde{}",
  "%": "\\%",
}

const replacements: [RegExp, string][] = [
  [/\u2018/g, "`"],
  [/\u2019/g, "'"],
  [/\u201c/g, "``"],
  [/\u201d/g, "''"],
  [/\u2026/g, "\\ldots{}"],
  [/\u2022/g, "\\textbullet{}"],
  [/\u00b7/g, "\\textperiodcentered{}"],
  [/\u2192/g, "$\\rightarrow$"],
  [/\u00d7/g, "$\\times$"],
  [/\u00a0/g, " "],
  [/\u2013/g, "--"],
  [/\u2014/g, "---"],
  [/\u2010|\u2011/g, "-"],
]

const guard = "\u0000"

const placeholder = (index: number): string => `${guard}${index}${guard}`

export const escapeTex = (input: string): string => {
  const held: string[] = []
  const stashed = input.replace(/[\\{}$&#^_~%]/g, (character) => {
    held.push(specials[character] ?? character)
    return placeholder(held.length - 1)
  })
  const typed = replacements.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    stashed,
  )
  return typed.replace(
    new RegExp(`${guard}(\\d+)${guard}`, "g"),
    (_, index: string) => held[Number.parseInt(index, 10)] ?? "",
  )
}

export const escapeTexList = (items: string[]): string =>
  items.map(escapeTex).filter((item) => item.trim().length > 0).join(", ")