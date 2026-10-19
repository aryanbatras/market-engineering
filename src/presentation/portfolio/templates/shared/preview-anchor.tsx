"use client"

import type { AnchorHTMLAttributes, ReactNode } from "react"
import { usePreviewMode } from "@presentation/core/preview/preview-mode"

type PreviewAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
}

export const PreviewAnchor = ({ children, ...rest }: PreviewAnchorProps) => {
  const preview = usePreviewMode()

  if (preview) {
    return <span {...rest}>{children}</span>
  }

  return (
    <a {...rest}>{children}</a>
  )
}