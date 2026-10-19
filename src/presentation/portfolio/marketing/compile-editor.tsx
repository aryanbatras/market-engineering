"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { LuCheck } from "react-icons/lu"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import { SourceEditor } from "@presentation/core/code-mirror/source-editor"
import { editorStyles } from "./editor.styles"
import { PortfolioPreview } from "./portfolio-preview"
import { previewStyles } from "./preview.styles"

const DEBOUNCE_MS = 400

const useDebounced = (value: string, delay: number) => {
  const [settled, setSettled] = useState(value)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSettled(value), delay)
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [value, delay])

  return settled
}

type CompileEditorProps = {
  initialText: string
}

export const CompileEditor = ({ initialText }: CompileEditorProps) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null)
  const [draft, setDraft] = useState(initialText)
  const settled = useDebounced(draft, DEBOUNCE_MS)

  const result = useMemo(() => parsePortfolioText(settled), [settled])
  const issues = result.ok ? 0 : result.issues.length

  return (
    <div className={editorStyles.root}>
      <div className={editorStyles.split}>
        <div className={editorStyles.editorShell}>
          <div className={editorStyles.paneHead}>
            <span className={editorStyles.paneLabel}>YAML</span>
            {result.ok ? (
              <span className={editorStyles.statusOk}>
                <LuCheck aria-hidden size={14} strokeWidth={2} />
                Valid
              </span>
            ) : (
              <span className={editorStyles.statusBad}>
                {issues} thing{issues === 1 ? "" : "s"} to fix
              </span>
            )}
          </div>
          <div className={editorStyles.editorFill}>
            <SourceEditor editable editorRef={editorRef} onChange={setDraft} value={draft} />
          </div>
        </div>

        <div className={editorStyles.stage}>
          <div className={editorStyles.paneHead}>
            <span className={editorStyles.paneLabel}>Rendered page</span>
            <span className={editorStyles.paneNote}>Live</span>
          </div>
          {result.ok ? (
            <div className={editorStyles.stageFill}>
              <PortfolioPreview data={result.data} />
            </div>
          ) : (
            <p className={previewStyles.empty}>
              The page appears the moment the file parses.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}