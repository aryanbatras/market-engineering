"use client"

import type { RefObject } from "react"
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror"
import { yamlExtensions } from "@presentation/core/code-mirror/yaml-editor"
import { editorStyles } from "./yaml-editor.styles"

type SourceEditorProps = {
  value?: string
  editable: boolean
  onChange?: (value: string) => void
  editorRef: RefObject<ReactCodeMirrorRef | null>
}

export const SourceEditor = ({ value, editable, onChange, editorRef }: SourceEditorProps) => (
  <div className={editorStyles.shell}>
    <CodeMirror
      basicSetup={false}
      className={editorStyles.host}
      editable={editable}
      extensions={yamlExtensions()}
      onChange={onChange}
      ref={editorRef}
      {...(value === undefined ? {} : { value })}
    />
  </div>
)