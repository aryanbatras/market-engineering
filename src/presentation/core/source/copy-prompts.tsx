"use client"

import { useEffect, useRef, useState } from "react"
import { LuCheck, LuChevronDown } from "react-icons/lu"
import { promptOptions } from "@application/core/source/prompt-options"
import { Button } from "@presentation/core/design/button"
import { cn } from "@presentation/core/design/cn"
import { copyPromptStyles } from "./copy-prompts.styles"

type CopyPromptsProps = {
  align?: "left" | "right"
}

export const CopyPrompts = ({ align = "left" }: CopyPromptsProps) => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const wrap = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const dismiss = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", dismiss)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", dismiss)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const copy = async (id: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt)
    setOpen(false)
    setCopied(id)
    window.setTimeout(() => setCopied(null), 2200)
  }

  return (
    <div className={copyPromptStyles.wrap} ref={wrap}>
      <Button
        aria-expanded={open}
        intent="ghost"
        onClick={() => setOpen((value) => !value)}
        size="small"
      >
        Copy for LLMs
        <LuChevronDown className={copyPromptStyles.chevron} size={14} strokeWidth={1.5} />
      </Button>

      {open ? (
        <div
          className={cn(
            align === "right" ? copyPromptStyles.panelWide : copyPromptStyles.panel,
          )}
          role="group"
        >
          {promptOptions.map((option) => (
            <button
              className={copyPromptStyles.item}
              key={option.id}
              onClick={() => void copy(option.id, option.prompt)}
              type="button"
            >
              <span className={copyPromptStyles.itemLabel}>{option.label}</span>
              <span className={copyPromptStyles.itemNote}>{option.note}</span>
            </button>
          ))}
        </div>
      ) : null}

      {copied ? (
        <p className={copyPromptStyles.done} role="status">
          <LuCheck className={copyPromptStyles.doneMark} size={14} strokeWidth={2} />
          Prompt copied. Paste it into any AI you already use.
        </p>
      ) : null}
    </div>
  )
}