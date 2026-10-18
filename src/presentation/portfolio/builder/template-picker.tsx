"use client"

import { LuArrowRight } from "react-icons/lu"
import { useState } from "react"
import { registry } from "@presentation/portfolio/templates/registry"
import { Button } from "@presentation/core/design/button"
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
      <h1 className={builderStyles.pickerTitle}>Pick a starting point</h1>
      <p className={builderStyles.pickerBody}>
        You can switch later without losing anything. Every preview is the real template.
      </p>

      <div className={builderStyles.pickerGrid}>
        {registry.map((entry) => (
          <button
            className={cn(
              builderStyles.pickerSlot,
              selected === entry.meta.id && builderStyles.pickerSlotActive,
            )}
            key={entry.meta.id}
            onClick={() => setSelected(entry.meta.id)}
            type="button"
          >
            <TemplateCard active={selected === entry.meta.id} meta={entry.meta} />
          </button>
        ))}
      </div>

      <div className={builderStyles.pickerAction}>
        <Button intent="primary" onClick={() => onSelect(selected)}>
          Use {registry.find((entry) => entry.meta.id === selected)?.meta.name}
          <LuArrowRight size={17} strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}