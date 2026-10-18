"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { resumeLayoutSpecs, defaultResumeLayout, defaultResumeSkin } from "@application/resume/resume-registry"
import { renderResume } from "@application/resume/render-resume"
import { sampleDocument } from "@application/resume/sample/sample-portfolio"
import type { ResumeLayoutSpec } from "@application/resume/resume-layout"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { cn } from "@presentation/core/design/cn"
import { Button } from "@presentation/core/design/button"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { galleryStyles } from "./resume-gallery.styles"

const sample = sampleDocument()

const LayoutGallery = () => {
  const [layoutId, setLayoutId] = useState(defaultResumeLayout.id)
  const spec: ResumeLayoutSpec =
    resumeLayoutSpecs.find((entry) => entry.id === layoutId) ?? defaultResumeLayout
  const rendered = useMemo(() => renderResume(sample, spec, defaultResumeSkin), [spec])

  const choose = (id: string) => {
    setLayoutId(id)
    window.history.replaceState(null, "", `/resume?layout=${id}`)
  }

  return (
    <div className={galleryStyles.shell}>
      <div className={galleryStyles.bar}>
        <div className={galleryStyles.barInner}>
          <Wordmark />
          <span className={galleryStyles.crumb}>Resume templates</span>
          <Link href="/resume">
            <Button intent="secondary" size="small">
              Skip to the editor
            </Button>
          </Link>
        </div>
      </div>

      <div className={galleryStyles.head}>
        <h1 className={galleryStyles.title}>Resume templates</h1>
        <p className={galleryStyles.lead}>
          The ten that Indian engineering students actually use, previewed with a real resume rather
          than lorem ipsum. Six read cleanly in a parser. Two are two-column, reorder what a machine
          sees, and say so before you pick one. Click one and the editor opens with it loaded.
        </p>
      </div>

      <div className={galleryStyles.split}>
        <div className={galleryStyles.list}>
          <p className={galleryStyles.listLabel}>Layouts</p>
          {resumeLayoutSpecs.map((entry) => (
            <Link
              className={cn(galleryStyles.item, entry.id === layoutId && galleryStyles.itemActive)}
              href={`/resume?layout=${entry.id}`}
              key={entry.id}
              onClick={() => choose(entry.id)}
            >
              <span className={galleryStyles.itemName}>{entry.name}</span>
              <span className={galleryStyles.itemMeta}>
                {entry.columns === 2 ? "Two columns, reorders in a parser" : "One column"}
              </span>
            </Link>
          ))}
        </div>

        <div className={galleryStyles.stage}>
          <h2 className={galleryStyles.stageName}>{spec.name}</h2>
          <p className={galleryStyles.stageSummary}>{spec.summary}</p>
          <p className={galleryStyles.stageFor}>{spec.forWhom}</p>
          <div className={galleryStyles.stageActions}>
            <Link href={`/resume?layout=${spec.id}`}>
              <Button intent="primary">Open the editor with {spec.name}</Button>
            </Link>
            <Link href="/builder">
              <Button intent="ghost">Make it a portfolio instead</Button>
            </Link>
          </div>
          <div className={galleryStyles.sheetWrap}>
            <DocumentSheet layout={rendered.layout} skin={defaultResumeSkin} spec={spec} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ResumeGallery = LayoutGallery