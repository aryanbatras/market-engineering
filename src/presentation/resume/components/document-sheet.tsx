import type { ReactNode } from "react"
import type { ResumeBlock, ResumeLayout, ResumeLayoutSpec, ResumeSkin } from "@application/resume/resume-layout"
import { cn } from "@presentation/core/design/cn"
import { sheetStyles } from "./document-sheet.styles"

type DocumentSheetProps = {
  layout: ResumeLayout
  spec: ResumeLayoutSpec
  skin: ResumeSkin
  className?: string
}

type SheetMetrics = {
  bodyPx: number
  smallest: number
  namePx: number
  sectionGap: number
  entryGap: number
  pagePadding: number
  rule: boolean
}

const measure = (spec: ResumeLayoutSpec, skin: ResumeSkin): SheetMetrics => {
  const pointsPerCm = 37.795
  const margin = skin.metrics.pageMargin * pointsPerCm
  const bodyPx = skin.metrics.bodySize * (96 / 72)
  const leading = bodyPx * 1.24

  const smallest = bodyPx * 0.93

  return {
    bodyPx,
    smallest,
    namePx: skin.metrics.nameSize * (96 / 72),
    sectionGap: skin.metrics.sectionGap * bodyPx * 0.45,
    entryGap: skin.metrics.entryGap * bodyPx * 0.45,
    pagePadding: margin * (794 / 595),
    rule: skin.metrics.headingRule && spec.headingStyle === "rule",
  }
}

const accentClass = (skin: ResumeSkin): string => (skin.accent === "blue" ? "bg-blue" : "bg-ink")

const bulletMarks = { dot: "•", dash: "—", none: "" } as const

const entryTitle = (block: Extract<ResumeBlock, { kind: "entry" }>): string =>
  block.organisation.length > 0 ? `${block.title}, ${block.organisation}` : block.title

type BlockProps = {
  block: ResumeBlock
  spec: ResumeLayoutSpec
  skin: ResumeSkin
  metrics: SheetMetrics
}

const Block = ({ block, spec, skin, metrics }: BlockProps) => {
  switch (block.kind) {
    case "name":
      return (
        <h1
          className={cn(
            spec.nameStyle === "boxed"
              ? cn(sheetStyles.nameBoxed, accentClass(skin))
              : spec.headerAlign === "centred"
                ? sheetStyles.nameCentred
                : sheetStyles.name,
          )}
          style={{ fontSize: `${metrics.namePx}px` }}
        >
          {block.text}
        </h1>
      )
    case "note":
      return (
        <p
          className={cn(
            sheetStyles.note,
            spec.headlineStyle === "bold" && sheetStyles.noteBold,
            spec.headerAlign === "centred" && sheetStyles.centred,
          )}
          style={{ fontSize: `${metrics.bodyPx}px` }}
        >
          {block.text}
        </p>
      )
    case "contact":
      return (
        <p
          className={cn(
            sheetStyles.contact,
            spec.headerAlign === "centred" && sheetStyles.centred,
          )}
          style={{ fontSize: `${metrics.smallest}px` }}
        >
          {block.items.join(spec.contactSeparator === "bar" ? "  |  " : "  ·  ")}
        </p>
      )
    case "heading": {
      const style =
        block.style === "bar"
          ? sheetStyles.headingBar
          : block.style === "caret"
            ? sheetStyles.headingCaret
            : block.style === "rule" && metrics.rule
              ? sheetStyles.headingRule
              : sheetStyles.headingPlain

      return (
        <h2
          className={cn(
            style,
            spec.headingCaps && sheetStyles.headingCaps,
            block.style === "bar" && accentClass(skin),
          )}
          style={{ marginTop: `${metrics.sectionGap}px`, fontSize: `${metrics.bodyPx * 1.12}px` }}
        >
          {block.style === "caret" ? <span aria-hidden className={sheetStyles.caret} /> : null}
          {block.text}
        </h2>
      )
    }
    case "entry":
      return (
        <div className={sheetStyles.entry} style={{ marginTop: `${metrics.entryGap}px` }}>
          {block.style === "inline" ? (
            <p className={sheetStyles.entryInline} style={{ fontSize: `${metrics.bodyPx}px` }}>
              <span className={sheetStyles.entryTitle}>{entryTitle(block)}</span>
              {block.dates.length > 0 ? (
                <span aria-hidden className={sheetStyles.entryDivider}>
                  {"  ·  "}
                </span>
              ) : null}
              <span className={sheetStyles.entryDates}>{block.dates}</span>
            </p>
          ) : (
            <p className={sheetStyles.entryLine}>
              <span className={sheetStyles.entryTitle} style={{ fontSize: `${metrics.bodyPx}px` }}>
                {entryTitle(block)}
              </span>
              <span className={sheetStyles.entryDates} style={{ fontSize: `${metrics.smallest}px` }}>
                {block.dates}
              </span>
            </p>
          )}
          {block.meta.length > 0 ? (
            <p className={sheetStyles.entryMeta} style={{ fontSize: `${metrics.smallest}px` }}>
              {block.meta}
            </p>
          ) : null}
          {block.summary.length > 0 ? (
            <p className={sheetStyles.entrySummary} style={{ fontSize: `${metrics.bodyPx}px` }}>
              {block.summary}
            </p>
          ) : null}
          {block.bullets.length > 0 ? (
            <ul
              className={cn(
                sheetStyles.bullets,
                skin.metrics.bulletStyle === "none" && sheetStyles.bulletsPlain,
              )}
            >
              {block.bullets.map((bullet) => (
                <li className={sheetStyles.bullet} key={bullet} style={{ fontSize: `${metrics.bodyPx}px` }}>
                  {bulletMarks[skin.metrics.bulletStyle].length > 0 ? (
                    <span aria-hidden className={sheetStyles.bulletMark}>
                      {bulletMarks[skin.metrics.bulletStyle]}
                    </span>
                  ) : null}
                  {bullet}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )
    case "skills":
      return (
        <div className={sheetStyles.skills}>
          {block.groups.map((group) => (
            <p
              className={sheetStyles.skillLine}
              key={group.label + group.items.join()}
              style={{ fontSize: `${metrics.smallest}px` }}
            >
              {group.label.length > 0 ? <span className={sheetStyles.skillLabel}>{group.label}: </span> : null}
              {group.items.join(", ")}
            </p>
          ))}
        </div>
      )
  }
}

const Blocks = ({
  blocks,
  spec,
  skin,
  metrics,
}: {
  blocks: ResumeBlock[]
  spec: ResumeLayoutSpec
  skin: ResumeSkin
  metrics: SheetMetrics
}) => (
  <>
    {blocks.map((block, index) => (
      <Block block={block} key={`${block.kind}-${index}`} metrics={metrics} skin={skin} spec={spec} />
    ))}
  </>
)

const headerLength = (blocks: ResumeBlock[]): number => {
  const first = blocks.findIndex((block) => block.kind === "heading")
  return first === -1 ? blocks.length : first
}

export const DocumentSheet = ({ layout, spec, skin, className }: DocumentSheetProps) => {
  const rail = new Set(layout.railIndexes)
  const railBlocks = layout.blocks.filter((_, index) => rail.has(index))
  const body = layout.blocks.slice(headerLength(layout.blocks))
  const metrics = measure(spec, skin)

  const head: ReactNode = (
    <Blocks
      blocks={layout.blocks.slice(0, headerLength(layout.blocks))}
      metrics={metrics}
      skin={skin}
      spec={spec}
    />
  )

  return (
    <div className={cn(sheetStyles.frame, className)}>
      <div className={sheetStyles.stage}>
        <article
          className={sheetStyles.page}
          data-layout={spec.id}
          style={{ fontSize: `${metrics.bodyPx}px`, padding: `${metrics.pagePadding}px` }}
        >
          {head}
          {spec.headerRule ? <span aria-hidden className={sheetStyles.headerRule} /> : null}

          {spec.columns === 2 ? (
            <div className={sheetStyles.columns} style={{ marginTop: `${metrics.sectionGap}px` }}>
              <div
                className={cn(sheetStyles.rail, spec.railTint && sheetStyles.railTinted)}
                style={{ width: `${spec.railWidth * 100}%` }}
              >
                <Blocks blocks={railBlocks} metrics={metrics} skin={skin} spec={spec} />
              </div>
              <div className={sheetStyles.main}>
                <Blocks blocks={body} metrics={metrics} skin={skin} spec={spec} />
              </div>
            </div>
          ) : (
            <Blocks blocks={body} metrics={metrics} skin={skin} spec={spec} />
          )}
        </article>
      </div>
    </div>
  )
}