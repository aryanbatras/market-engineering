"use client"

import { useMemo } from "react"
import Link from "next/link"
import { resumeLayoutSpecs, defaultResumeSkin } from "@application/resume/resume-registry"
import { renderResume } from "@application/resume/render-resume"
import { sampleDocument } from "@application/resume/sample/sample-portfolio"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { galleryStyles } from "./resume-gallery.styles"

const sample = sampleDocument()

const cards = resumeLayoutSpecs.map((spec) => ({
  spec,
  layout: renderResume(sample, spec, defaultResumeSkin).layout,
}))

const LayoutGallery = () => {
  const preview = useMemo(() => cards, [])

  return (
    <div className={galleryStyles.shell}>
      <div className={galleryStyles.bar}>
        <div className={galleryStyles.barInner}>
          <Wordmark />
          <span className={galleryStyles.crumb}>Resume templates</span>
        </div>
      </div>

      <div className={galleryStyles.page}>
        <div className={galleryStyles.head}>
          <h1 className={galleryStyles.title}>Resume templates</h1>
          <p className={galleryStyles.lead}>
            The ten that Indian engineering students already use, previewed with a real resume rather
            than lorem ipsum. Eight read cleanly in a parser. Two are two-column, reorder what a
            machine sees, and say so before you pick one. Click one and the editor opens with it
            loaded.
          </p>
        </div>

        <div className={galleryStyles.grid}>
          {preview.map((card) => (
            <Link className={galleryStyles.item} href={`/resume?layout=${card.spec.id}`} key={card.spec.id}>
              <div className={galleryStyles.frame}>
                <div className={galleryStyles.canvas}>
                  <DocumentSheet layout={card.layout} skin={defaultResumeSkin} spec={card.spec} />
                </div>
              </div>
              <div className={galleryStyles.foot}>
                <span className={galleryStyles.name}>{card.spec.name}</span>
                <span className={galleryStyles.meta}>
                  {card.spec.columns === 2
                    ? "Two columns — a parser reorders it"
                    : card.spec.headingStyle === "rule"
                      ? "One column, ruled sections"
                      : card.spec.headingStyle === "bar"
                        ? "One column, filled headings"
                        : "One column"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const ResumeGallery = LayoutGallery