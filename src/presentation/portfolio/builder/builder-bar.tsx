"use client"

import Link from "next/link"
import { LuDownload } from "react-icons/lu"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { Button } from "@presentation/core/design/button"
import { CopyPrompts } from "@presentation/core/source/copy-prompts"
import { builderBarStyles } from "./builder-bar.styles"

type BuilderBarProps = {
  crumb: string
  exportName: string
  onExport: () => void
  onPublish: () => void
  publishLabel: string
  publishBusy: boolean
  showPublish: boolean
}

export const BuilderBar = ({
  crumb,
  exportName,
  onExport,
  onPublish,
  publishBusy,
  publishLabel,
  showPublish,
}: BuilderBarProps) => (
  <div className={builderBarStyles.bar}>
    <div className={builderBarStyles.inner}>
      <div className={builderBarStyles.left}>
        <Wordmark />
        <span className={builderBarStyles.crumb}>{crumb}</span>
      </div>

      <div className={builderBarStyles.actions}>
        <CopyPrompts />

        <Link href="/resume/templates">
          <Button intent="ghost" size="small">
            Resume templates
          </Button>
        </Link>

        <Link href="/resume">
          <Button intent="ghost" size="small">
            Make it a resume
          </Button>
        </Link>

        <Button intent="ghost" onClick={onExport} size="small">
          <LuDownload size={16} strokeWidth={1.5} />
          {exportName}
        </Button>

        {showPublish ? (
          <Button disabled={publishBusy} intent="primary" onClick={onPublish} size="small">
            {publishLabel}
          </Button>
        ) : null}
      </div>
    </div>
  </div>
)