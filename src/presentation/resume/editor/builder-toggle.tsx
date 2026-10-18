"use client"

import { useState } from "react"
import { LuChevronDown, LuRows3 } from "react-icons/lu"
import { Button } from "@presentation/core/design/button"
import { cn } from "@presentation/core/design/cn"
import { editorStyles } from "./resume-editor.styles"

type BuilderToggleProps = {
  view: "stacked" | "compact"
  onView: (view: "stacked" | "compact") => void
  schemaOpen: boolean
  onToggleSchema: () => void
}

const views = [
  {
    id: "stacked",
    label: "Full sections",
    note: "Structure, YAML, LaTeX and the page, one after another",
  },
  {
    id: "compact",
    label: "One screen",
    note: "All four side by side, so you see everything at once",
  },
] as const

export const BuilderToggle = ({ view, onView, schemaOpen, onToggleSchema }: BuilderToggleProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={editorStyles.controlGroup}>
      <Button
        aria-expanded={open}
        intent="secondary"
        onClick={() => setOpen((value) => !value)}
        size="small"
      >
        <LuRows3 size={15} strokeWidth={1.5} />
        View
        <LuChevronDown className={editorStyles.chevron} size={14} strokeWidth={1.5} />
      </Button>

      {open ? (
        <div className={editorStyles.popover} role="group">
          {views.map((entry) => (
            <button
              className={cn(editorStyles.popItem, view === entry.id && editorStyles.popItemOn)}
              key={entry.id}
              onClick={() => {
                onView(entry.id)
                setOpen(false)
              }}
              type="button"
            >
              <span>{entry.label}</span>
              <span className={editorStyles.popNote}>{entry.note}</span>
            </button>
          ))}
          <button
            className={cn(editorStyles.popItem, schemaOpen && editorStyles.popItemOn)}
            onClick={() => {
              onToggleSchema()
              setOpen(false)
            }}
            type="button"
          >
            <span>Field guide</span>
            <span className={editorStyles.popNote}>
              {schemaOpen ? "Hide" : "Show"} the list of every field
            </span>
          </button>
        </div>
      ) : null}
    </div>
  )
}