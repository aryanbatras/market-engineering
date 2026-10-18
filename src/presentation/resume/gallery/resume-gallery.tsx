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
  const rendered = useMemo(
    () => renderResume(sample, spec, defaultResumeSkin),
    [spec],
  )

  return (
    <div className={galleryStyles.shell}>
      <div className={galleryStyles.bar}>
        <div className={galleryStyles.barInner}>
          <Wordmark />
          <Link href="/resume">
            <Button intent="secondary" size="small">
              Open the editor
            </Button>
          </Link>
        </div>
      </div>

      <div className={galleryStyles.head}>
        <h1 className={galleryStyles.title}>Ten layouts, picked for you</h1>
        <p className={galleryStyles.lead}>
          Previewed with a real resume, not lorem ipsum. Six read cleanly in a parser. Two are
          two-column, reorder what a machine sees, and say so before you choose one.
        </p>
      </div>

      <div className={galleryStyles.split}>
        <div className={galleryStyles.list}>
          <p className={galleryStyles.listLabel}>Layouts</p>
          {resumeLayoutSpecs.map((entry) => (
            <button
              className={cn(galleryStyles.item, entry.id === layoutId && galleryStyles.itemActive)}
              key={entry.id}
              onClick={() => setLayoutId(entry.id)}
              type="button"
            >
              <span className={galleryStyles.itemName}>{entry.name}</span>
              <span className={galleryStyles.itemMeta}>
                {entry.columns === 2 ? "Two columns, reorders in a parser" : "One column"}
              </span>
            </button>
          ))}
        </div>

        <div className={galleryStyles.stage}>
          <h2 className={galleryStyles.stageName}>{spec.name}</h2>
          <p className={galleryStyles.stageSummary}>{spec.summary}</p>
          <p className={galleryStyles.stageFor}>{spec.forWhom}</p>
          <div className={galleryStyles.sheetWrap}>
            <DocumentSheet layout={rendered.layout} skin={defaultResumeSkin} spec={spec} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const ResumeGallery = LayoutGallery