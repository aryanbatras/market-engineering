export const atsPreamble = [
  "\\usepackage[T1]{fontenc}",
  "\\usepackage{lmodern}",
  "\\usepackage{cmap}",
].join("\n")

export const atsPreambleExplanation = [
  "T1 encoding, Latin Modern and a cmap ToUnicode map.",
  "Together these make ligature glyphs extract as their letters, so a keyword",
  "search for \"efficient\" or \"profile\" still finds them.",
].join(" ")