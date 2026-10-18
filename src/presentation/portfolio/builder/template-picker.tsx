"use client"

import { useState } from "react"
import { registry } from "@presentation/portfolio/templates/registry"
import { cn } from "@presentation/core/design/cn"
import { builderStyles } from "./builder.styles"
import { TemplateCard } from "./template-gallery"

type TemplatePickerProps = {
  onSelect: (id: string) => void
}

export const TemplatePicker = ({ onSelect }: TemplatePickerProps) => {
  const [selected, setSelected] = useState("classic")

  return (
    <div className={builderStyles.picker}>
      <h1 className={builderStyles.pickerTitle}>Pick a template</h1>
      <p className={builderStyles.pickerBody}>
        Click one to open the editor with it already loaded. Every preview is the real template, and
        you can switch later without losing anything.
      </p>

      <div className={builderStyles.pickerGrid}>
        {registry.map((entry) => (
          <button
            className={cn(
              builderStyles.pickerSlot,
              selected === entry.meta.id && builderStyles.pickerSlotActive,
            )}
            key={entry.meta.id}
            onClick={() => {
              setSelected(entry.meta.id)
              onSelect(entry.meta.id)
            }}
            type="button"
          >
            <TemplateCard active={selected === entry.meta.id} meta={entry.meta} />
          </button>
        ))}
      </div>
    </div>
  )
}