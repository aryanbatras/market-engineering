import type { ResumeBlock, ResumeLayout, ResumeLayoutSpec, ResumeSkin } from "@application/resume/resume-layout"
import { cn } from "@presentation/core/design/cn"
import { sheetStyles } from "./document-sheet.styles"

type DocumentSheetProps = {
  layout: ResumeLayout
  spec: ResumeLayoutSpec
  skin: ResumeSkin
  className?: string
}

const accentClass = (skin: ResumeSkin): string =>
  skin.accent === "blue" ? "bg-blue" : "bg-ink"

const Block = ({ block, spec, skin }: { block: ResumeBlock; spec: ResumeLayoutSpec; skin: ResumeSkin }) => {
  switch (block.kind) {
    case "name":
      return (
        <h1 className={cn(spec.id === "header" ? sheetStyles.accentName : sheetStyles.name, spec.id === "header" && accentClass(skin))}>
          {block.text}
        </h1>
      )
    case "note":
      return <p className={sheetStyles.note}>{block.text}</p>
    case "contact":
      return <p className={sheetStyles.contact}>{block.items.join("  ·  ")}</p>
    case "heading": {
      const style = spec.id === "colour" ? sheetStyles.accentHeading : block.rule ? sheetStyles.headingRule : sheetStyles.headingPlain
      return (
        <h2 className={cn(style, spec.id === "colour" && accentClass(skin))}>{block.text}</h2>
      )
    }
    case "entry":
      return (
        <div className={sheetStyles.entry}>
          <p className={sheetStyles.entryLine}>
            <span className={sheetStyles.entryTitle}>
              {block.organisation.length > 0 ? `${block.title}, ${block.organisation}` : block.title}
            </span>
            <span className={sheetStyles.entryDates}>{block.dates}</span>
          </p>
          {block.meta.length > 0 ? <p className={sheetStyles.entryMeta}>{block.meta}</p> : null}
          {block.summary.length > 0 ? <p className={sheetStyles.entrySummary}>{block.summary}</p> : null}
          {block.bullets.length > 0 ? (
            <ul className={sheetStyles.bullets}>
              {block.bullets.map((bullet) => (
                <li className={sheetStyles.bullet} key={bullet}>
                  <span aria-hidden className={sheetStyles.bulletMark}>•</span>
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
            <p className={sheetStyles.skillLine} key={group.label + group.items.join()}>
              {group.label.length > 0 ? <span className={sheetStyles.skillLabel}>{group.label}: </span> : null}
              {group.items.join(", ")}
            </p>
          ))}
        </div>
      )
  }
}

const Blocks = ({ blocks, spec, skin }: { blocks: ResumeBlock[]; spec: ResumeLayoutSpec; skin: ResumeSkin }) => (
  <>
    {blocks.map((block, index) => (
      <Block block={block} key={`${block.kind}-${index}`} skin={skin} spec={spec} />
    ))}
  </>
)

export const DocumentSheet = ({ layout, spec, skin, className }: DocumentSheetProps) => {
  const rail = new Set(layout.railIndexes)
  const railBlocks = layout.blocks.filter((_, index) => rail.has(index))
  const mainBlocks = layout.blocks.filter((_, index) => !rail.has(index))
  const isTwoColumn = spec.columns === 2

  return (
    <div className={cn(sheetStyles.frame, className)}>
      <div className={sheetStyles.stage}>
        <article className={sheetStyles.page}>
          {isTwoColumn ? (
            <div className={sheetStyles.columns}>
              <div className={sheetStyles.rail}>
                <Blocks blocks={railBlocks} skin={skin} spec={spec} />
              </div>
              <div className={sheetStyles.main}>
                <Blocks blocks={mainBlocks} skin={skin} spec={spec} />
              </div>
            </div>
          ) : (
            <Blocks blocks={layout.blocks} skin={skin} spec={spec} />
          )}
        </article>
      </div>
    </div>
  )
}