"use client"

import type { ResumeLayoutSpec } from "@application/resume/resume-layout"
import { cn } from "@presentation/core/design/cn"
import { editorStyles } from "../editor/resume-editor.styles"

type LayoutPickerProps = {
  specs: ResumeLayoutSpec[]
  layoutId: string
  onSelect: (id: string) => void
}

export const LayoutPicker = ({ specs, layoutId, onSelect }: LayoutPickerProps) => (
  <div className={editorStyles.picker} role="group">
    {specs.map((spec) => (
      <button
        aria-pressed={spec.id === layoutId}
        className={cn(editorStyles.pickChip, spec.id === layoutId && editorStyles.pickChipOn)}
        key={spec.id}
        onClick={() => onSelect(spec.id)}
        type="button"
      >
        {spec.name}
      </button>
    ))}
  </div>
)