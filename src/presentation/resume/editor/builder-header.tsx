"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { LuDownload } from "react-icons/lu"
import { Button } from "@presentation/core/design/button"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { CopyPrompts } from "@presentation/core/source/copy-prompts"
import { BuilderToggle } from "./builder-toggle"
import { editorStyles } from "./resume-editor.styles"

type BuilderHeaderProps = {
  canExport: boolean
  busy: boolean
  controls: ReactNode
  onDownloadPdf: () => void
  onDownloadTex: () => void
  onSignIn: () => void
  schemaOpen: boolean
  signedIn: boolean
  view: "stacked" | "compact"
  onToggleSchema: () => void
  onView: (view: "stacked" | "compact") => void
}

export const BuilderHeader = ({
  busy,
  canExport,
  controls,
  onDownloadPdf,
  onDownloadTex,
  onSignIn,
  onToggleSchema,
  onView,
  schemaOpen,
  signedIn,
  view,
}: BuilderHeaderProps) => (
  <div className={editorStyles.bar}>
    <div className={editorStyles.barInner}>
      <div className={editorStyles.barLeft}>
        <Wordmark />
        <span className={editorStyles.crumb}>Resume</span>
        {controls}
      </div>

      <div className={editorStyles.barCentre}>
        <BuilderToggle
          onToggleSchema={onToggleSchema}
          onView={onView}
          schemaOpen={schemaOpen}
          view={view}
        />
      </div>

      <div className={editorStyles.actionRow}>
        <CopyPrompts align="right" />

        <Link href="/resume/templates">
          <Button intent="ghost" size="small">
            Layouts
          </Button>
        </Link>

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
      </div>
    </div>
  </div>
)