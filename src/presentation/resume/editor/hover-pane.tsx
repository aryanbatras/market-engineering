"use client"

import { useState, type ReactNode } from "react"
import { LuCode, LuCopy, LuListTree } from "react-icons/lu"
import { Button } from "@presentation/core/design/button"
import { cn } from "@presentation/core/design/cn"
import { editorStyles } from "./resume-editor.styles"

type HoverPaneProps = {
  label: string
  icon: typeof LuListTree
  children: ReactNode
}

export const HoverPane = ({ label, icon: Icon, children }: HoverPaneProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={editorStyles.hoverPane}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        aria-expanded={open}
        className={editorStyles.hoverTrigger}
        data-hover-trigger={label}
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <Icon size={14} strokeWidth={1.5} />
        {label}
      </button>

      <div className={cn(editorStyles.hoverBody, open && editorStyles.hoverBodyOpen)}>
        <div className={editorStyles.hoverInner}>{children}</div>
      </div>
    </div>
  )
}

export const CopyButton = ({ label, text }: { label: string; text: string }) => {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      intent="ghost"
      onClick={() => {
        void navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      }}
      size="small"
    >
      <LuCopy size={14} strokeWidth={1.5} />
      {copied ? `${label} copied` : label}
    </Button>
  )
}