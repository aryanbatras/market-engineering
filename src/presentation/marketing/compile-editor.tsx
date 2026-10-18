"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { yaml as yamlLang } from "@codemirror/lang-yaml"
import { EditorView, keymap, highlightActiveLine } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import {
  syntaxHighlighting,
  HighlightStyle,
  bracketMatching,
  indentOnInput,
} from "@codemirror/language"
import { tags } from "@lezer/highlight"
import { LuCheck, LuClock, LuPencil } from "react-icons/lu"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { portfolioUrl, siteConfig } from "@application/site/site-config"
import { cn } from "@presentation/design/cn"
import { Button } from "@presentation/design/button"
import { editorStyles } from "./editor.styles"

const DEBOUNCE_MS = 5000
const TYPE_MS = 9

type Block = {
  lines: string[]
  holdMs: number
}

const yamlHighlight = HighlightStyle.define([
  { tag: tags.comment, color: "var(--color-ink-45)", fontStyle: "italic" },
  { tag: tags.propertyName, color: "var(--color-blue)", fontWeight: "500" },
  { tag: tags.string, color: "var(--color-ink-70)" },
  { tag: tags.number, color: "var(--color-ink)" },
  { tag: tags.bool, color: "var(--color-ink)" },
  { tag: tags.punctuation, color: "var(--color-ink-45)" },
  { tag: tags.bracket, color: "var(--color-ink-45)" },
])

const editorTheme = EditorView.theme({
  "&": { fontSize: "13px", backgroundColor: "transparent" },
  ".cm-content": { fontFamily: "var(--font-geist-mono)", padding: "14px 0" },
  ".cm-activeLine": { backgroundColor: "rgb(10 10 11 / 0.03)" },
  ".cm-cursor": { borderLeftColor: "var(--color-blue)", borderLeftWidth: "2px" },
  "&.cm-focused": { outline: "none" },
  ".cm-selectionBackground": { backgroundColor: "var(--color-blue-wash)" },
})

const extensions = [
  history(),
  indentOnInput(),
  bracketMatching(),
  highlightActiveLine(),
  syntaxHighlighting(yamlHighlight),
  keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
  yamlLang(),
  editorTheme,
]

const buildBlocks = (fullText: string): Block[] => {
  const lines = fullText.trimEnd().split("\n")
  const blocks: Block[] = []
  let current: string[] = []

  for (const line of lines) {
    current.push(line)
    if (line.trim().length === 0 || current.length >= 4) {
      blocks.push({ lines: current, holdMs: current.length <= 2 ? 900 : 1600 })
      current = []
    }
  }
  if (current.length > 0) blocks.push({ lines: current, holdMs: 2200 })
  return blocks
}

const PortfolioFragment = ({ data }: { data: Portfolio }) => (
  <div className={editorStyles.previewBody}>
    <div className={editorStyles.previewCard}>
      <p className={editorStyles.previewName}>{data.identity.name}</p>
      {data.identity.headline ? (
        <p className={editorStyles.previewHeadline}>{data.identity.headline}</p>
      ) : null}
      {data.identity.location ? (
        <p className={editorStyles.previewMeta}>
          {[data.identity.location, data.identity.availability].filter(Boolean).join(" · ")}
        </p>
      ) : null}
    </div>

    {data.experience.slice(0, 1).map((item) => (
      <div className={editorStyles.previewExperience} key={item.organisation}>
        <p className={editorStyles.previewExperienceOrg}>
          {item.role ? `${item.role}, ${item.organisation}` : item.organisation}
        </p>
        <p className={editorStyles.previewExperienceMeta}>
          {[item.start, item.current ? "Present" : item.end].filter(Boolean).join(" → ")}
        </p>
      </div>
    ))}

    <div>
      {data.projects.slice(0, 2).map((project) => (
        <div className={editorStyles.previewProject} key={project.name}>
          <p className={editorStyles.previewProjectName}>{project.name}</p>
          {project.tech.length > 0 ? (
            <div className={editorStyles.previewTags}>
              {project.tech.slice(0, 4).map((tech) => (
                <span className={editorStyles.previewTag} key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
)

const useDebouncedValue = (value: string, delay: number) => {
  const [settled, setSettled] = useState(value)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setSettled(value), delay)
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [value, delay])

  return settled
}

type DemoPhase = "playing" | "editing"

export const CompileEditor = ({ initialText }: { initialText: string }) => {
  const [phase, setPhase] = useState<DemoPhase>("playing")
  const [draft, setDraft] = useState(initialText)
  const [typed, setTyped] = useState(0)
  const [activeBlock, setActiveBlock] = useState(0)

  const settled = useDebouncedValue(draft, DEBOUNCE_MS)
  const blocks = useMemo(() => buildBlocks(initialText), [initialText])
  const totalChars = useMemo(
    () => blocks.reduce((sum, block) => sum + block.lines.join("\n").length, 0),
    [blocks],
  )

  const playedText = useMemo(() => initialText.slice(0, typed), [initialText, typed])
  const shown = phase === "editing" ? draft : playedText

  const parsed = useMemo(() => parsePortfolioText(settled), [settled])
  const liveParsed = useMemo(() => parsePortfolioText(shown), [shown])
  const portfolio = phase === "editing" ? (parsed.ok ? parsed.data : null) : liveParsed.ok ? liveParsed.data : null

  const isPending = phase === "editing" && draft !== settled

  useEffect(() => {
    if (phase !== "playing") return
    if (typed >= totalChars) {
      const restart = window.setTimeout(() => {
        setTyped(0)
        setActiveBlock(0)
      }, 4000)
      return () => window.clearTimeout(restart)
    }

    const char = initialText[typed - 1] ?? ""
    const onBreak = char === "\n"
    const delay = onBreak ? 70 : TYPE_MS

    const timer = window.setTimeout(() => {
      setTyped((current) => current + 1)
      let consumed = 0
      for (let index = 0; index < blocks.length; index += 1) {
        consumed += blocks[index]?.lines.join("\n").length ?? 0
        if (typed + 1 >= consumed) {
          setActiveBlock(index)
          break
        }
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [phase, typed, totalChars, initialText, blocks])

  const startEditing = () => setPhase("editing")
  const replay = () => {
    setTyped(0)
    setActiveBlock(0)
    setPhase("playing")
  }

  return (
    <div className={editorStyles.root}>
      <div className={editorStyles.split}>
        <div className={editorStyles.left}>
          <div className={editorStyles.bar}>
            <span className={editorStyles.file}>portfolio.yaml</span>
            <div className={editorStyles.barRight}>
              <span className={editorStyles.counter}>
                {activeBlock + 1}/{blocks.length} blocks
              </span>
              {phase === "playing" ? (
                <Button intent="secondary" onClick={startEditing} size="small">
                  <LuPencil size={15} strokeWidth={1.5} />
                  Edit yourself
                </Button>
              ) : (
                <Button intent="quiet" onClick={replay} size="small">
                  Replay
                </Button>
              )}
            </div>
          </div>

          <div className={cn(editorStyles.frame, editorStyles.editorHost)} data-ui>
            <CodeMirror basicSetup={false} extensions={extensions} onChange={setDraft} value={shown} />
          </div>

          <div className={editorStyles.statusRow}>
            {parsed.ok ? (
              <p className={editorStyles.statusOk}>
                <LuCheck aria-hidden size={14} strokeWidth={2} />
                Valid against the schema
              </p>
            ) : (
              <p className={editorStyles.statusBad}>
                {parsed.issues.length} thing{parsed.issues.length === 1 ? "" : "s"} to fix
              </p>
            )}
            <p className={editorStyles.hint}>
              {phase === "playing" ? (
                "Watch it build, then take the pen."
              ) : isPending ? (
                <span className={editorStyles.statusPending}>
                  <LuClock aria-hidden size={13} strokeWidth={1.5} />
                  Preview updates 5s after you stop typing
                </span>
              ) : (
                "Edit it. Try changing the name."
              )}
            </p>
          </div>
        </div>

        <div className={editorStyles.right}>
          <div className={editorStyles.previewPane}>
            {portfolio ? (
              <PortfolioFragment data={portfolio} />
            ) : (
              <p className={editorStyles.previewEmpty}>Fix the errors and the page appears here.</p>
            )}
            <div className={editorStyles.previewFoot}>
              <span className={editorStyles.previewUrl}>
                {portfolio ? portfolioUrl(portfolio.meta?.handle ?? "yourname") : `${siteConfig.origin}/p/`}
              </span>
              <span className={editorStyles.previewLive}>live preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}