"use client"

import { useRef } from "react"
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { SourceEditor } from "@presentation/code-mirror/source-editor"
import { builderStyles } from "./builder.styles"

type YamlSourceProps = {
  value: string
  onChange: (value: string) => void
}

export const YamlSource = ({ value, onChange }: YamlSourceProps) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  return (
    <div className={builderStyles.sourceFrame}>
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
