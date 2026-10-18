"use client"

import { useState } from "react"
import { LuChevronDown, LuSlidersHorizontal } from "react-icons/lu"
import { Button } from "@presentation/core/design/button"
import { LayoutPicker } from "@presentation/resume/components/layout-picker"
import { resumeLayoutSpecs } from "@application/resume/resume-registry"
import type { FontScale, PageMargin, SectionGap } from "@application/resume/resume-layout"
import { editorStyles } from "./resume-editor.styles"

const fontScales: FontScale[] = ["small", "medium", "large"]
const sectionGaps: SectionGap[] = ["tight", "normal", "roomy"]
const margins: PageMargin[] = ["narrow", "normal", "wide"]

const label = (value: string) => value[0]?.toUpperCase() + value.slice(1)

type BuilderControlsProps = {
  layoutId: string
  onLayout: (id: string) => void
  fontScale: FontScale
  sectionGap: SectionGap
  margin: PageMargin
  onFontScale: (value: FontScale) => void
  onSectionGap: (value: SectionGap) => void
  onMargin: (value: PageMargin) => void
}

export const BuilderControls = ({
  fontScale,
  layoutId,
  margin,
  onFontScale,
  onLayout,
  onMargin,
  onSectionGap,
  sectionGap,
}: BuilderControlsProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={editorStyles.tuneWrap}>
      <Button
        aria-expanded={open}
        intent="secondary"
        onClick={() => setOpen((value) => !value)}
        size="small"
      >
        <LuSlidersHorizontal size={15} strokeWidth={1.5} />
        Layout and size
        <LuChevronDown className={editorStyles.chevron} size={14} strokeWidth={1.5} />
      </Button>

      <div className={open ? editorStyles.tuneOpen : editorStyles.tune}>
        <div className={editorStyles.tuneGroup}>
          <span className={editorStyles.controlLabel}>Layout</span>
          <LayoutPicker layoutId={layoutId} onSelect={onLayout} specs={resumeLayoutSpecs} />
        </div>

        <div className={editorStyles.tuneGroup}>
          <span className={editorStyles.controlLabel}>Type size</span>
          <div className={editorStyles.controlGroup}>
            {fontScales.map((value) => (
              <Button
                intent={fontScale === value ? "primary" : "ghost"}
                key={value}
                onClick={() => onFontScale(value)}
                size="small"
              >
                {label(value)}
              </Button>
            ))}
          </div>
        </div>

        <div className={editorStyles.tuneGroup}>
          <span className={editorStyles.controlLabel}>Section gap</span>
          <div className={editorStyles.controlGroup}>
            {sectionGaps.map((value) => (
              <Button
                intent={sectionGap === value ? "primary" : "ghost"}
                key={value}
                onClick={() => onSectionGap(value)}
                size="small"
              >
                {label(value)}
              </Button>
            ))}
          </div>
        </div>

        <div className={editorStyles.tuneGroup}>
          <span className={editorStyles.controlLabel}>Page margin</span>
          <div className={editorStyles.controlGroup}>
            {margins.map((value) => (
              <Button
                intent={margin === value ? "primary" : "ghost"}
                key={value}
                onClick={() => onMargin(value)}
                size="small"
              >
                {label(value)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}