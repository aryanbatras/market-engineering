"use client"

import { useRef } from "react"
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { SourceEditor } from "@presentation/core/code-mirror/source-editor"
import { cn } from "@presentation/core/design/cn"
import { sourceStyles } from "./source.styles"

type YamlSourceProps = {
  value: string
  onChange: (value: string) => void
  fill?: boolean
}

export const YamlSource = ({ value, onChange, fill = false }: YamlSourceProps) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null)

  return (
    <div className={cn(sourceStyles.frame, fill && sourceStyles.frameFill)}>
      <SourceEditor
        editable
        editorRef={editorRef}

        onChange={onChange}
        value={value}
      />
    </div>
  )
}