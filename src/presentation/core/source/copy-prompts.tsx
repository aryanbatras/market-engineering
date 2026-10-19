"use client"

import { useState } from "react"
import { promptOptions } from "@application/core/source/prompt-options"
import { Button } from "@presentation/core/design/button"
import { Dialog } from "@presentation/core/design/dialog"
import { Toast } from "@presentation/core/design/toast"
import { copyPromptStyles } from "./copy-prompts.styles"

type CopyPromptsProps = {
  align?: "left" | "right"
}

export const CopyPrompts = ({ align = "left" }: CopyPromptsProps) => {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (id: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt)
    setOpen(false)
    setCopied(id)
    window.setTimeout(() => setCopied(null), 2600)
  }

  return (
    <>
      <Button intent="ghost" onClick={() => setOpen(true)} size="small">
        Copy for LLMs
      </Button>

      <Dialog
        align={align}
        lead="Paste one into ChatGPT, Gemini, or whatever you already pay for. Nothing runs on our side, and your resume never leaves your browser."
        onClose={() => setOpen(false)}
        open={open}
        title="Copy a prompt"
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
      </Dialog>

      <Toast
        message={copied ? "Prompt copied. Paste it into any AI you already use." : null}
      />
    </>
  )
}