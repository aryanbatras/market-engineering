"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { yaml as yamlLang } from "@codemirror/lang-yaml"
import { EditorView, keymap, highlightActiveLine } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { syntaxHighlighting, HighlightStyle, bracketMatching, indentOnInput } from "@codemirror/language"
import { tags } from "@lezer/highlight"
import { LuCheck, LuClock } from "react-icons/lu"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { portfolioUrl, siteConfig } from "@application/site/site-config"
import { cn } from "@presentation/design/cn"
import { editorStyles } from "./editor.styles"

const DEBOUNCE_MS = 5000

const yamlHighlight = HighlightStyle.define([
  { tag: tags.comment, color: "var(--color-ink-45)", fontStyle: "italic" },
  { tag: tags.propertyName, color: "var(--color-blue)", fontWeight: "500" },
  { tag: tags.string, color: "var(--color-ink-70)" },
  { tag: tags.number, color: "var(--color-ink)" },
  { tag: tags.bool, color: "var(--color-ink)" },
  { tag: tags.null, color: "var(--color-ink)" },
  { tag: tags.punctuation, color: "var(--color-ink-45)" },
  { tag: tags.bracket, color: "var(--color-ink-45)" },
])

const editorTheme = EditorView.theme({
  "&": { fontSize: "13px", backgroundColor: "transparent" },
  ".cm-content": { fontFamily: "var(--font-geist-mono)", padding: "14px 0" },
  ".cm-activeLine": { backgroundColor: "rgb(10 10 11 / 0.03)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--color-ink-70)" },
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
        {item.summary ? (
          <p className={editorStyles.previewExperienceBody}>{item.summary}</p>
        ) : null}
      </div>
    ))}

    <div>
      {data.projects.slice(0, 2).map((project) => (
        <div className={editorStyles.previewProject} key={project.name}>
          <p className={editorStyles.previewProjectName}>{project.name}</p>
          {project.description ? (
            <p className={editorStyles.previewProjectBody}>{project.description}</p>
          ) : null}
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

type CompileEditorProps = {
  initialText: string
}

export const CompileEditor = ({ initialText }: CompileEditorProps) => {
  const [draft, setDraft] = useState(initialText)
  const settled = useDebouncedValue(draft, DEBOUNCE_MS)
  const isPending = draft !== settled

  const parsed = useMemo(() => parsePortfolioText(settled), [settled])
  const portfolio = parsed.ok ? parsed.data : null

  const lineCount = useMemo(() => draft.split("\n").length, [draft])

  const handleChange = useCallback((value: string) => setDraft(value), [])

  return (
    <div className={editorStyles.root}>
      <div className={editorStyles.split}>
        <div className={editorStyles.left}>
          <div className={editorStyles.bar}>
            <span className={editorStyles.file}>portfolio.yaml</span>
            <span className={editorStyles.counter}>{lineCount} lines</span>
          </div>

          <div className={cn(editorStyles.frame, editorStyles.editorHost)} data-ui>
            <CodeMirror
              basicSetup={false}
              extensions={extensions}
              onChange={handleChange}
              value={draft}
            />
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
              {isPending ? (
                <span className={editorStyles.statusPending}>
                  <LuClock aria-hidden size={13} strokeWidth={1.5} />
                  Editing — preview updates when you stop typing
                </span>
              ) : (
                "Edit it. Try changing the name."
              )}
            </p>
          </div>

          {!parsed.ok ? (
            <ul className={editorStyles.issueList}>
              {parsed.issues.slice(0, 3).map((issue) => (
                <li className={editorStyles.issue} key={`${issue.field}-${issue.message}`}>
                  <span className={editorStyles.issueField}>{issue.field}</span> — {issue.message}
                </li>
              ))}
            </ul>
          ) : null}
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