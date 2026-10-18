"use client"

import CodeMirror from "@uiw/react-codemirror"
import { yaml as yamlLang } from "@codemirror/lang-yaml"
import { EditorView, keymap } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import {
  syntaxHighlighting,
  HighlightStyle,
  bracketMatching,
  indentOnInput,
} from "@codemirror/language"
import { lineNumbers } from "@codemirror/view"
import { tags } from "@lezer/highlight"
import { builderStyles } from "./builder.styles"

const highlight = HighlightStyle.define([
  { tag: tags.comment, color: "var(--color-ink-45)", fontStyle: "italic" },
  { tag: tags.propertyName, color: "var(--color-blue)", fontWeight: "500" },
  { tag: tags.string, color: "var(--color-ink-70)" },
  { tag: tags.number, color: "var(--color-ink)" },
  { tag: tags.bool, color: "var(--color-ink)" },
  { tag: tags.punctuation, color: "var(--color-ink-45)" },
  { tag: tags.bracket, color: "var(--color-ink-45)" },
])

const theme = EditorView.theme({
  "&": { fontSize: "13px", backgroundColor: "transparent" },
  ".cm-content": { fontFamily: "var(--font-geist-mono)", padding: "10px 0" },
  ".cm-gutters": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--color-ink-45)",
  },
  ".cm-activeLine": { backgroundColor: "rgb(10 10 11 / 0.03)" },
  ".cm-cursor": { borderLeftColor: "var(--color-blue)", borderLeftWidth: "2px" },
  "&.cm-focused": { outline: "none" },
  ".cm-selectionBackground": { backgroundColor: "var(--color-blue-wash)" },
})

const extensions = [
  lineNumbers(),
  history(),
  indentOnInput(),
  bracketMatching(),
  syntaxHighlighting(highlight),
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  yamlLang(),
  theme,
]

type YamlSourceProps = {
  value: string
  onChange: (value: string) => void
}

export const YamlSource = ({ value, onChange }: YamlSourceProps) => (
  <div className={builderStyles.sourceFrame}>
    <CodeMirror basicSetup={false} extensions={extensions} onChange={onChange} value={value} />
  </div>
)
