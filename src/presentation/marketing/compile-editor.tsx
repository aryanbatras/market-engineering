"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { LuCheck } from "react-icons/lu"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import { portfolioUrl, siteConfig } from "@application/site/site-config"
import { SourceEditor } from "@presentation/code-mirror/source-editor"
import { editorStyles } from "./editor.styles"
import { PortfolioPreview } from "./portfolio-preview"
import { previewStyles } from "./preview.styles"

const DEBOUNCE_MS = 600

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

  return (
    <div className={editorStyles.root}>
      <div className={editorStyles.split}>
        <div className={editorStyles.left}>
          <div className={editorStyles.editorShell}>
            <SourceEditor
              editable
              editorRef={editorRef}
              lineNumbers={false}
              onChange={setDraft}
              value={draft}
            />
          </div>
          <div className={editorStyles.statusRow}>
            {result.ok ? (
              <p className={editorStyles.statusOk}>
                <LuCheck aria-hidden size={14} strokeWidth={2} />
                Valid
              </p>
            ) : (
              <p className={editorStyles.statusBad}>
                {result.issues.length} thing{result.issues.length === 1 ? "" : "s"} to fix
              </p>
            )}
            {pending ? <p className={editorStyles.statusPending}>Rendering as you type</p> : null}
          </div>
        </div>

        <div className={editorStyles.right}>
          <div className={editorStyles.editorShell}>
            <div className={previewStyles.scroll}>
              {result.ok ? (
                <PortfolioPreview data={result.data} />
              ) : (
                <p className={previewStyles.empty}>
                  {result.issues.length} thing{result.issues.length === 1 ? "" : "s"} to fix. The page
                  appears the moment the file parses.
                </p>
              )}
            </div>
            <div className={editorStyles.previewFoot}>
              <span className={editorStyles.previewUrl}>
                {result.ok
                  ? portfolioUrl(result.data.meta?.handle ?? "nainakumari")
                  : `${siteConfig.origin}/p/`}
              </span>
              <span className={editorStyles.previewLive}>live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}