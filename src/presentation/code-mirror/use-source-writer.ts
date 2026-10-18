"use client"

import { useCallback, type RefObject } from "react"
import { EditorView } from "@codemirror/view"
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror"

type SourceWriter = {
  rewrite: (text: string) => void
  reveal: (text: string, length: number) => void
}

export const useSourceWriter = (ref: RefObject<ReactCodeMirrorRef | null>): SourceWriter => {
  const rewrite = useCallback(
    (text: string) => {
      const view = ref.current?.view
      if (!view) return
      const current = view.state.doc.toString()
      if (current === text) return
      view.dispatch({ changes: { from: 0, to: current.length, insert: text } })
      view.dispatch({ effects: EditorView.scrollIntoView(0, { y: "start" }) })
    },
    [ref],
  )

  const reveal = useCallback(
    (text: string, length: number) => {
      const view = ref.current?.view
      if (!view) return
      const current = view.state.doc.toString()
      if (current === text.slice(0, length)) return
      const grownFrom = text.startsWith(current) ? current.length : 0
      view.dispatch({
        changes: { from: grownFrom, to: current.length, insert: text.slice(grownFrom, length) },
        selection: { anchor: length },
        effects: EditorView.scrollIntoView(length, { y: "end" }),
      })
    },
    [ref],
  )

  return { rewrite, reveal }
}