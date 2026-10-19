"use client"

import { useState } from "react"
import Link from "next/link"
import { LuCheck, LuChevronDown } from "react-icons/lu"
import type { ResumeLayoutSpec } from "@application/resume/resume-layout"
import { resumeLayoutSpecs } from "@application/resume/resume-registry"
import { Button } from "@presentation/core/design/button"
import { cn } from "@presentation/core/design/cn"
import { editorStyles } from "../editor/resume-editor.styles"

type LayoutPickerProps = {
  layoutId: string
  onSelect: (id: string) => void
  specs?: ResumeLayoutSpec[]
}

export const LayoutPicker = ({ layoutId, onSelect, specs = resumeLayoutSpecs }: LayoutPickerProps) => {
  const [open, setOpen] = useState(false)
  const current = specs.find((spec) => spec.id === layoutId) ?? specs[0]

  return (
    <div className={editorStyles.controlGroup}>
      <Button
        aria-expanded={open}
        intent="ghost"
        onClick={() => setOpen((value) => !value)}
        size="small"
      >
        {current?.name ?? "Change template"}
        <LuChevronDown className={editorStyles.chevron} size={14} strokeWidth={1.5} />
      </Button>

      {open ? (
        <div className={cn(editorStyles.popover, editorStyles.popoverLeft)} role="group">
          {specs.map((spec) => (
            <button
              className={cn(editorStyles.popItem, spec.id === layoutId && editorStyles.popItemOn)}
              key={spec.id}
              onClick={() => {
                onSelect(spec.id)
                setOpen(false)
              }}
              type="button"
            >
              <span className={editorStyles.popItemHead}>
                {spec.name}
                {spec.id === layoutId ? (
                  <LuCheck size={14} strokeWidth={2} />
                ) : (
                  <span className={editorStyles.popItemMeta}>
                    {spec.columns === 2 ? "Two columns" : "One column"}
                  </span>
                )}
              </span>
              <span className={editorStyles.popNote}>{spec.forWhom}</span>
            </button>
          ))}
          <Link className={editorStyles.popItem} href="/resume/templates">
            See all ten with previews
          </Link>
        </div>
      ) : null}
    </div>
  )
}