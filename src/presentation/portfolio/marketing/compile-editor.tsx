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
  const pending = draft !== settled
  const issues = result.ok ? 0 : result.issues.length

  return (
    <div className={editorStyles.root}>
      <div className={editorStyles.split}>
        <div className={editorStyles.editorShell} data-flow="parser">
          <SourceEditor editable editorRef={editorRef} onChange={setDraft} value={draft} />
          <div className={editorStyles.statusRow}>
            {result.ok ? (
              <p className={editorStyles.statusOk}>
                <LuCheck aria-hidden size={14} strokeWidth={2} />
                Valid
              </p>
            ) : (
              <p className={editorStyles.statusBad}>
                {issues} thing{issues === 1 ? "" : "s"} to fix
              </p>
            )}
          </div>
        </div>

        <div className={editorStyles.stage} data-flow="render">
          {result.ok ? (
            <PortfolioPreview data={result.data} />
          ) : (
            <p className={editorStyles.empty}>
              {issues} thing{issues === 1 ? "" : "s"} to fix. The page appears the moment the file
              parses.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}