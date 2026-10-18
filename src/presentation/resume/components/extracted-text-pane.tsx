import type { AtsReport } from "@application/resume/ats/ats-report"
import { cn } from "@presentation/core/design/cn"
import { atsStyles } from "./extracted-text-pane.styles"

type ExtractedTextPaneProps = {
  report: AtsReport
  mocked?: boolean
  label?: string
  note?: string
  excerptLines?: number
  className?: string
}

export const ExtractedTextPane = ({
  report,
  mocked = false,
  label = "extracted text layer",
  note,
  excerptLines = 8,
  className,
}: ExtractedTextPaneProps) => {
  const excerpt = report.text.split("\n").slice(0, excerptLines).join("\n")

  return (
    <div className={cn(atsStyles.root, className)}>
      <div>
        <p className={cn(atsStyles.heading)}>This is what a recruiter&apos;s software reads</p>
        {note === undefined ? null : <p className={atsStyles.note}>{note}</p>}
      </div>

      <div className={atsStyles.pane} data-ui>
        <div className={atsStyles.paneHead}>
          <p className={atsStyles.paneLabel}>{label}</p>
          {mocked ? <p className={atsStyles.mockBadge}>not compiled here</p> : null}
        </div>
        <p className={atsStyles.paneText}>{excerpt}</p>
      </div>

      <div>
        {report.findings.length === 0 ? (
          <p className={atsStyles.verdictPass}>Nothing to fix. Every heading, date and word reads in order.</p>
        ) : null}
        <ul className={cn(atsStyles.list, report.findings.length > 0 ? "mt-3" : "")}>
          {report.findings.map((finding) => (
            <li
              className={finding.severity === "warning" ? atsStyles.findingWarning : atsStyles.finding}
              key={finding.check}
            >
              <p className={atsStyles.findingKind}>{finding.check}</p>
              <p className={atsStyles.findingMessage}>{finding.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}