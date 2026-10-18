"use client"

import { useRef } from "react"
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { SourceEditor } from "@presentation/core/code-mirror/source-editor"
import { sourceStyles } from "./source.styles"

type YamlSourceProps = {
  value: string
  onChange: (value: string) => void
}

export const YamlSource = ({ value, onChange }: YamlSourceProps) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  return (
    <div className={sourceStyles.frame}>
      <SourceEditor
        editable
        editorRef={editorRef}
        lineNumbers
        onChange={onChange}
        value={value}
      />
    </div>
  )
}