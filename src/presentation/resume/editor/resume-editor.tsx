"use client"

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { LuCheck, LuCode, LuListTree, LuTriangleAlert } from "react-icons/lu"
import type { AtsReport } from "@application/resume/ats/ats-report"
import { documentSchema } from "@application/resume/document-schema"
import {
  defaultResumeLayout,
  defaultResumeSkin,
  resumeLayoutSpecs,
} from "@application/resume/resume-registry"
import { renderResume } from "@application/resume/render-resume"
import { initialResumeYaml, resumeParseResult } from "@application/resume/sample/parse-document"
import { useSession } from "@application/core/auth/use-session"
import { YamlSource } from "@presentation/core/source/yaml-source"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { BuilderControls } from "@presentation/resume/editor/builder-controls"
import { BuilderHeader } from "@presentation/resume/editor/builder-header"
import { CopyButton, HoverPane } from "@presentation/resume/editor/hover-pane"
import { TexPanel } from "@presentation/resume/editor/tex-panel"
import { editorStyles } from "./resume-editor.styles"

const FieldGuide = () => (
  <div className={editorStyles.schema}>
    {documentSchema.map((group) => (
      <div className={editorStyles.schemaGroup} key={group.title}>
        <p className={editorStyles.schemaKey}>{group.title}</p>
        {group.fields.map((field) => (
          <p
            className={field.list ? editorStyles.schemaList : editorStyles.schemaValue}
            key={field.key}
          >
            {field.key}: {field.example}
          </p>
        ))}
      </div>
    ))}
  </div>
)

const structureText = () =>
  documentSchema
    .map((group) =>
      [
        group.title,
        ...group.fields.map((field) =>
          field.list ? `${field.key}: ${field.example}` : `${field.key}: ${field.example}`,
        ),
      ].join("\n"),
    )
    .join("\n\n")

export const ResumeEditor = () => {
  const params = useSearchParams()
  const requested = params.get("layout")
  const [draft, setDraft] = useState(initialResumeYaml)
  const [layoutId, setLayoutId] = useState(
    resumeLayoutSpecs.some((entry) => entry.id === requested)
      ? (requested ?? defaultResumeLayout.id)
      : defaultResumeLayout.id,
  )
  const [skin, setSkin] = useState(defaultResumeSkin)
  const [view, setView] = useState<"stacked" | "compact">("stacked")
  const [report, setReport] = useState<AtsReport | null>(null)
  const [busy, setBusy] = useState(false)
  const { session, signIn } = useSession()

  const parsed = useMemo(() => resumeParseResult(draft), [draft])
  const portfolio = parsed.ok ? parsed.data : null
  const spec =
    resumeLayoutSpecs.find((entry) => entry.id === layoutId) ?? defaultResumeLayout

  const rendered = useMemo(
    () => (portfolio ? renderResume(portfolio, spec, skin) : null),
    [portfolio, spec, skin],
  )

  useEffect(() => {
    if (portfolio === null || rendered === null) return
    let active = true
    void import("@infrastructure/resume/resolve-pdf-text-extractor").then(
      async ({ pdfTextExtractor }) => {
        const text = await pdfTextExtractor.extractText(rendered.pdf)
        const { runAtsCheck } = await import("@application/resume/ats/run-ats-check")
        if (active) setReport(runAtsCheck(rendered.document, text, spec))
      },
    )
    return () => {
      active = false
    }
  }, [portfolio, rendered, spec])

  const fileBase = portfolio
    ? portfolio.identity.name.replace(/\s+/g, "-").toLowerCase()
    : "resume"

  const triggerDownload = (url: string, name: string): void => {
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = name
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const downloadPdf = () => {
    if (rendered === null) return
    setBusy(true)
    window.setTimeout(() => {
      triggerDownload(
        URL.createObjectURL(new Blob([rendered.pdf], { type: "application/pdf" })),
        `${fileBase}.pdf`,
      )
      setBusy(false)
    }, 60)
  }

  const sheet = rendered ? <DocumentSheet layout={rendered.layout} skin={skin} spec={spec} /> : null

  const yamlPane = (head: ReactNode) => (
    <div className={editorStyles.pane}>
      <div className={editorStyles.paneHead}>
        {head}
        <span className={parsed.ok ? editorStyles.ok : editorStyles.bad}>
          {parsed.ok ? (
            <>
              <LuCheck size={14} strokeWidth={2} /> Valid
            </>
          ) : (
            `${parsed.issues.length} to fix`
          )}
        </span>
      </div>
      <div className={editorStyles.band}>
        <YamlSource fill onChange={setDraft} value={draft} />
      </div>
    </div>
  )

  const sheetPane = (
    <div className={editorStyles.pane}>
      <div className={editorStyles.paneHead}>
        <span className={editorStyles.paneTitle}>{spec.name}</span>
        {report && report.passed ? <span className={editorStyles.ok}>Reads in order</span> : null}
      </div>
      <div className={editorStyles.band}>
        <div className={editorStyles.sheetScroll}>{sheet}</div>
      </div>
    </div>
  )

  return (
    <div className={editorStyles.shell}>
      <BuilderHeader
        busy={busy}
        canExport={rendered !== null}
        controls={
          <BuilderControls
            metrics={skin.metrics}
            onMetrics={(metrics) => setSkin((current) => ({ ...current, metrics }))}
          />
        }
        layoutId={layoutId}
        onDownloadPdf={downloadPdf}
        onDownloadTex={() =>
          rendered
            ? triggerDownload(
                URL.createObjectURL(new Blob([rendered.tex], { type: "application/x-tex" })),
                `${fileBase}.tex`,
              )
            : undefined
        }
        onLayout={setLayoutId}
        onSignIn={() => void signIn()}
        onView={setView}
        signedIn={session !== null}
        view={view}
      />

      <div className={editorStyles.stage}>
        {spec.atsClean ? null : (
          <p className={editorStyles.warning}>
            <LuTriangleAlert className={editorStyles.warningMark} size={14} strokeWidth={1.5} />
            {spec.name} is two columns. A parser reads one column before the other, so the sections
            come out in a different order than they appear.
          </p>
        )}

        {view === "compact" ? (
          <div className={editorStyles.compact}>
            {yamlPane(
              <div className={editorStyles.headRow}>
                <span className={editorStyles.paneTitle}>YAML</span>
                <HoverPane icon={LuListTree} label="Structure">
                  <FieldGuide />
                </HoverPane>
                <HoverPane icon={LuCode} label="LaTeX">
                  <TexPanel source={rendered?.tex ?? ""} />
                </HoverPane>
              </div>,
            )}
            {sheetPane}
          </div>
        ) : (
          <div className={editorStyles.stacked}>
            <div className={editorStyles.stackedRow}>
              {yamlPane(<span className={editorStyles.paneTitle}>YAML</span>)}
              {sheetPane}
            </div>

            <div className={editorStyles.stackedRow}>
              <div className={editorStyles.pane}>
                <div className={editorStyles.paneHead}>
                  <span className={editorStyles.paneTitle}>Every field</span>
                  <CopyButton label="Copy structure" text={structureText()} />
                </div>
                <div className={editorStyles.band}>
                  <div className={editorStyles.paneFill}>
                    <FieldGuide />
                  </div>
                </div>
              </div>

              <div className={editorStyles.pane}>
                <div className={editorStyles.paneHead}>
                  <span className={editorStyles.paneTitle}>Generated LaTeX</span>
                  <div className={editorStyles.headRow}>
                    <span className={editorStyles.paneNote}>{rendered?.pages ?? 0} pages</span>
                    <CopyButton label="Copy LaTeX" text={rendered?.tex ?? ""} />
                  </div>
                </div>
                <div className={editorStyles.band}>
                  <TexPanel source={rendered?.tex ?? ""} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ResumeEditorSuspense = () => (
  <Suspense fallback={<div className={editorStyles.loading}>Loading the editor…</div>}>
    <ResumeEditor />
  </Suspense>
)

export const ResumeEditorRoute = ResumeEditorSuspense