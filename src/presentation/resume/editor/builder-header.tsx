"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { LuDownload } from "react-icons/lu"
import { Button } from "@presentation/core/design/button"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { CopyPrompts } from "@presentation/core/source/copy-prompts"
import { LayoutPicker } from "@presentation/resume/components/layout-picker"
import { resumeLayoutSpecs } from "@application/resume/resume-registry"
import { BuilderToggle } from "./builder-toggle"
import { editorStyles } from "./resume-editor.styles"

type BuilderHeaderProps = {
  busy: boolean
  canExport: boolean
  controls: ReactNode
  layoutId: string
  onDownloadPdf: () => void
  onDownloadTex: () => void
  onLayout: (id: string) => void
  onSignIn: () => void
  onView: (view: "stacked" | "compact") => void
  signedIn: boolean
  view: "stacked" | "compact"
}

export const BuilderHeader = ({
  busy,
  canExport,
  controls,
  layoutId,
  onDownloadPdf,
  onDownloadTex,
  onLayout,
  onSignIn,
  onView,
  signedIn,
  view,
}: BuilderHeaderProps) => (
  <div className={editorStyles.bar}>
    <div className={editorStyles.barInner}>
      <div className={editorStyles.barLeft}>
        <Wordmark />
        {controls}
        <LayoutPicker layoutId={layoutId} onSelect={onLayout} specs={resumeLayoutSpecs} />
      </div>

      <div className={editorStyles.actionRow}>
        <CopyPrompts align="right" />

        <Link href="/builder">
          <Button intent="ghost" size="small">
            Make it a portfolio
          </Button>
        </Link>

        <Button intent="secondary" disabled={!canExport} onClick={onDownloadTex} size="small">
          <LuDownload size={16} strokeWidth={1.5} />
          .tex
        </Button>

        <Button disabled={!canExport || busy} intent="primary" onClick={onDownloadPdf} size="small">
          <LuDownload size={16} strokeWidth={1.5} />
          {busy ? "Preparing" : "Download PDF"}
        </Button>

        {signedIn ? (
          <Link className={editorStyles.account} href="/dashboard">
            Dashboard
          </Link>
        ) : (
          <Button intent="ghost" onClick={onSignIn} size="small">
            Sign in
          </Button>
        )}

        <BuilderToggle onView={onView} view={view} />
      </div>
    </div>
  </div>
)