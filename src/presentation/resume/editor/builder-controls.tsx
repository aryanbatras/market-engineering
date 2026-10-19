"use client"

import { useState } from "react"
import { LuChevronDown, LuSlidersHorizontal } from "react-icons/lu"
import {
  resumeMetricRanges,
  type ResumeMetrics,
} from "@application/resume/resume-metrics"
import { Button } from "@presentation/core/design/button"
import { editorStyles } from "./resume-editor.styles"

const bulletOptions: ResumeMetrics["bulletStyle"][] = ["none", "dash", "dot"]

const label = (value: string) => value[0]?.toUpperCase() + value.slice(1)

type BuilderControlsProps = {
  metrics: ResumeMetrics
  onMetrics: (metrics: ResumeMetrics) => void
}

export const BuilderControls = ({ metrics, onMetrics }: BuilderControlsProps) => {
  const [open, setOpen] = useState(false)

  const set = (field: keyof ResumeMetrics, value: number | boolean | string) =>
    onMetrics({ ...metrics, [field]: value })

  return (
    <div className={editorStyles.tuneWrap}>
      <Button
        aria-expanded={open}
        intent="secondary"
        onClick={() => setOpen((value) => !value)}
        size="small"
      >
        <LuSlidersHorizontal size={15} strokeWidth={1.5} />
        Size and spacing
        <LuChevronDown className={editorStyles.chevron} size={14} strokeWidth={1.5} />
      </Button>

      <div className={open ? editorStyles.tuneOpen : editorStyles.tune}>
        <div className={editorStyles.tuneGrid}>
          {resumeMetricRanges.map((range) => {
            const current = metrics[range.field] as number
            return (
              <label className={editorStyles.tuneField} key={range.field}>
                <span className={editorStyles.tuneLabel}>
                  {range.label}
                  <span className={editorStyles.tuneValue}>
                    {Number(current.toFixed(2))} {range.unit}
                  </span>
                </span>
                <input
                  aria-label={range.label}
                  className={editorStyles.tuneRange}
                  max={range.max}
                  min={range.min}
                  onChange={(event) => set(range.field, Number(event.target.value))}
                  step={range.step}
                  type="range"
                  value={current}
                />
              </label>
            )
          })}
        </div>

        <div className={editorStyles.tuneGroup}>
          <span className={editorStyles.controlLabel}>Bullet mark</span>
          <div className={editorStyles.controlGroup}>
            {bulletOptions.map((value) => (
              <Button
                intent={metrics.bulletStyle === value ? "primary" : "ghost"}
                key={value}
                onClick={() => set("bulletStyle", value)}
                size="small"
              >
                {label(value)}
              </Button>
            ))}
          </div>
        </div>

        <div className={editorStyles.tuneGroup}>
          <span className={editorStyles.controlLabel}>Section rule</span>
          <div className={editorStyles.controlGroup}>
            <Button
              intent={metrics.headingRule ? "primary" : "ghost"}
              onClick={() => set("headingRule", !metrics.headingRule)}
              size="small"
            >
              {metrics.headingRule ? "On" : "Off"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}