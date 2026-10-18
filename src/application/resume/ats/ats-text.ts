export const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/

const ligatureGlyphs = ["ﬁ", "ﬂ", "ﬀ", "ﬃ", "ﬄ"]

export const ligatureProneWords = [
  "efficient",
  "profile",
  "workflow",
  "staff",
  "office",
  "financial",
  "engineering",
  "infrastructure",
  "first",
  "finding",
]

export const normaliseText = (text: string): string =>
  text
    .replace(/\r/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim()

export const containsLigatureGlyph = (text: string): boolean =>
  ligatureGlyphs.some((glyph) => text.includes(glyph))

export const findEmail = (text: string): string | null => {
  const match = normaliseText(text).match(emailPattern)
  return match ? match[0] : null
}

export const firstLines = (text: string, count: number): string[] =>
  normaliseText(text).split("\n").slice(0, count)

export const linesMatching = (text: string, needle: string): string[] =>
  normaliseText(text)
    .split("\n")
    .filter((line) => line.length > 0 && line.toLowerCase().includes(needle.toLowerCase()))

export const firstIndexOf = (text: string, needles: string[]): number => {
  const haystack = normaliseText(text).toLowerCase()
  let best = -1
  for (const needle of needles) {
    const at = haystack.indexOf(needle.toLowerCase())
    if (at !== -1 && (best === -1 || at < best)) best = at
  }
  return best
}