"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { LuX } from "react-icons/lu"
import { cn } from "@presentation/core/design/cn"
import { dialogStyles } from "./dialog.styles"

type DialogProps = {
  open: boolean
  title: string
  lead?: string
  onClose: () => void
  children: ReactNode
  align?: "left" | "right"
}

export const Dialog = ({ open, title, lead, onClose, children, align = "left" }: DialogProps) => {
  const panel = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) panel.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div
      className={cn(dialogStyles.scrim, align === "right" && dialogStyles.scrimRight)}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        aria-label={title}
        aria-modal="true"
        className={dialogStyles.panel}
        onMouseDown={(event) => event.stopPropagation()}
        ref={panel}
        role="dialog"
        tabIndex={-1}
      >
        <div className={dialogStyles.head}>
          <div>
            <h2 className={dialogStyles.title}>{title}</h2>
            {lead ? <p className={dialogStyles.lead}>{lead}</p> : null}
          </div>
          <button
            aria-label="Close"
            className={dialogStyles.close}
            onClick={onClose}
            type="button"
          >
            <LuX size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className={dialogStyles.body}>{children}</div>
      </div>
    </div>
  )
}