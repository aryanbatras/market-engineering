import { EditorView } from "@codemirror/view"
import { HighlightStyle, bracketMatching, syntaxHighlighting } from "@codemirror/language"
import { tags } from "@lezer/highlight"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view"
import { yaml as yamlLang } from "@codemirror/lang-yaml"
import { EditorView as View } from "@codemirror/view"

export const editorGround = "#3d4451"
export const editorInk = "#e6edf3"

const key = "#7ee787"
const string = "#a5d6ff"
const atom = "#79c0ff"
const literal = "#ff7b72"
const punct = "#8b949e"
const comment = "#8b949e"

export const yamlHighlight = HighlightStyle.define([
  { tag: tags.comment, color: comment, fontStyle: "italic" },
  { tag: tags.propertyName, color: key, fontWeight: "600" },
  { tag: tags.definitionKeyword, color: key, fontWeight: "600" },
  { tag: tags.atom, color: atom },
  { tag: tags.bool, color: literal },
  { tag: tags.number, color: atom },
  { tag: tags.null, color: literal },
  { tag: tags.string, color: string },
  { tag: tags.punctuation, color: punct },
  { tag: tags.bracket, color: punct },
  { tag: tags.separator, color: punct },
  { tag: tags.invalid, color: literal },
  { tag: tags.link, color: string, textDecoration: "underline" },
])

export const yamlTheme = View.theme({
  "&": {
    fontSize: "14px",
    height: "100%",
    color: editorInk,
    backgroundColor: `${editorGround} !important`,
  },
  "&.cm-editor": { backgroundColor: `${editorGround} !important` },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    overflow: "auto",
    flex: "1 1 auto",
    minHeight: "0",
    fontFamily: "var(--font-geist-mono)",
    lineHeight: "1.65",
  },
  ".cm-content": { padding: "18px 20px", caretColor: editorInk },
  ".cm-line": { padding: "0" },
  ".cm-gutters": { backgroundColor: `${editorGround} !important`, border: "none", color: "#6e7681" },
  ".cm-activeLine": { backgroundColor: "rgb(255 255 255 / 0.035)" },
  ".cm-cursor": { borderLeftColor: editorInk, borderLeftWidth: "2px" },
  ".cm-selectionBackground, ::selection": { backgroundColor: "rgb(56 139 253 / 0.38)" },
  ".cm-placeholder": { color: "#6e7681" },
})

export const yamlExtensions = () => [
  history(),
  bracketMatching(),
  syntaxHighlighting(yamlHighlight),
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  yamlLang(),
  EditorView.lineWrapping,
  yamlTheme,
]

export { EditorView }