import { EditorView } from "@codemirror/view"
import { HighlightStyle, bracketMatching, syntaxHighlighting } from "@codemirror/language"
import { tags } from "@lezer/highlight"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view"
import { yaml as yamlLang } from "@codemirror/lang-yaml"
import { lineNumbers } from "@codemirror/view"

export const yamlHighlight = HighlightStyle.define([
  { tag: tags.comment, color: "var(--color-ink-45)", fontStyle: "italic" },
  { tag: tags.propertyName, color: "var(--color-blue)", fontWeight: "500" },
  { tag: tags.string, color: "var(--color-ink-70)" },
  { tag: tags.number, color: "var(--color-ink)" },
  { tag: tags.bool, color: "var(--color-ink)" },
  { tag: tags.punctuation, color: "var(--color-ink-45)" },
  { tag: tags.bracket, color: "var(--color-ink-45)" },
])

export const yamlTheme = EditorView.theme({
  "&": { fontSize: "13px", backgroundColor: "transparent", height: "100%", maxHeight: "100%" },
  ".cm-scroller": { overflow: "auto", flex: "1 1 auto", minHeight: "0", fontFamily: "var(--font-geist-mono)" },
  ".cm-content": { padding: "16px 0" },
  ".cm-gutters": { backgroundColor: "transparent", border: "none", color: "var(--color-ink-45)" },
  ".cm-activeLine": { backgroundColor: "rgb(10 10 11 / 0.03)" },
  ".cm-cursor": { borderLeftColor: "var(--color-blue)", borderLeftWidth: "2px" },
  "&.cm-focused": { outline: "none" },
  ".cm-selectionBackground": { backgroundColor: "var(--color-blue-wash)" },
})

export const yamlExtensions = (withLineNumbers: boolean) => [
  ...(withLineNumbers ? [lineNumbers()] : []),
  history(),
  bracketMatching(),
  syntaxHighlighting(yamlHighlight),
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  yamlLang(),
  yamlTheme,
]