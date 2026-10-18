const winAnsiHigh: Record<string, string> = {
  "‘": "\x91",
  "’": "\x92",
  "“": "\x93",
  "”": "\x94",
  "–": "\x96",
  "—": "\x97",
  "•": "\x95",
  "…": "\x85",
  "€": "\x80",
  "™": "\x99",
  " ": " ",
}

const ascii = (code: number): string => String.fromCharCode(code)

export const toWinAnsi = (input: string): string => {
  let out = ""
  for (const character of input) {
    const mapped = winAnsiHigh[character]
    if (mapped !== undefined) {
      out += mapped
      continue
    }
    const code = character.codePointAt(0) ?? 63
    out += code < 256 ? ascii(code) : "?"
  }
  return out
}

export const escapePdfString = (input: string): string => {
  const bytes = toWinAnsi(input)
  let out = ""
  for (const character of bytes) {
    const code = character.charCodeAt(0)
    if (character === "\\") out += "\\\\"
    else if (character === "(") out += "\\("
    else if (character === ")") out += "\\)"
    else if (code < 32 || code > 126) out += `\\${code.toString(8).padStart(3, "0")}`
    else out += character
  }
  return out
}

const byteLength = (input: string): number => input.length