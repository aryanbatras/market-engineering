"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { LuArrowLeft, LuCheck, LuDownload, LuTriangleAlert } from "react-icons/lu"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import { builderYaml } from "@application/portfolio/hero-yaml"
import { resumeLayoutSpecs, defaultResumeLayout, defaultResumeSkin } from "@application/resume/resume-registry"
import { renderResume } from "@application/resume/render-resume"
import { checkResume } from "@application/resume/check-resume"
import type { AtsReport } from "@application/resume/ats/ats-report"
import type { ResumeLayoutSpec, ResumeSkin } from "@application/resume/resume-layout"
import { pdfTextExtractor } from "@infrastructure/resume/resolve-pdf-text-extractor"
import { resumeCompiler } from "@infrastructure/resume/resolve-resume-compiler"
import { Button } from "@presentation/design/button"
import { Wordmark } from "@presentation/marketing/wordmark"
import { YamlSource } from "@presentation/builder/yaml-source"
import { DocumentSheet } from "@presentation/resume/components/document-sheet"
import { ExtractedTextPane } from "@presentation/resume/components/extracted-text-pane"
import { editorStyles } from "./resume-editor.styles"

const downloadText = (filename: string, body: string, type: string): void => {
  downloadBlob(filename, new Blob([body], { type }))
}

const downloadBlob = (filename: string, blob: Blob): void => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const ResumeEditor = () => {
  const [draft, setDraft] = useState(builderYaml)
  const [layoutId, setLayoutId] = useState(defaultResumeLayout.id)
  const [skin, setSkin] = useState<ResumeSkin>(defaultResumeSkin)
  const [toast, setToast] = useState<string | null>(null)
  const [report, setReport] = useState<AtsReport | null>(null)
  const [compiled, setCompiled] = useState(false)
  const [busy, setBusy] = useState(false)

  const parsed = useMemo(() => parsePortfolioText(draft), [draft])
  const portfolio = parsed.ok ? parsed.data : null
  const spec: ResumeLayoutSpec =
    resumeLayoutSpecs.find((entry) => entry.id === layoutId) ?? defaultResumeLayout

  const rendered = useMemo(
    () => (portfolio ? renderResume(portfolio, spec, skin) : null),
    [portfolio, spec, skin],
  )

  useEffect(() => {
    if (portfolio === null) return
    let active = true
    void checkResume(portfolio, spec, skin, pdfTextExtractor, new Uint8Array()).then((result) => {
      if (active) setReport(result)
    })
    return () => {
      active = false
    }
  }, [portfolio, spec, skin])

  const visibleReport = portfolio === null ? null : report

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const fileBase = portfolio ? portfolio.identity.name.replace(/\s+/g, "-").toLowerCase() : "resume"

  const downloadPdf = () => {
    if (portfolio === null || rendered === null) return
    setBusy(true)
    void resumeCompiler
      .compile(rendered.tex, { timeoutMs: 60000 })
      .then(async (result) => {
        if (!result.ok) {
          flash("The compile failed. Download the .tex and we will look at it.")
          return
        }
        const next = await checkResume(portfolio, spec, skin, pdfTextExtractor, result.pdf)
        setCompiled(true)
        setReport(next)
        downloadBlob(`${fileBase}.pdf`, new Blob([result.pdf], { type: "application/pdf" }))
        flash(`PDF downloaded · ${result.pages} page${result.pages === 1 ? "" : "s"}`)
      })
      .finally(() => setBusy(false))
  }

  return (
    <div className={editorStyles.shell}>
      <div className={editorStyles.bar}>
        <div className={editorStyles.barInner}>
          <div className={editorStyles.barLeft}>
            <Wordmark />
            <span className={editorStyles.crumb}>Resume</span>
          </div>
          <div className={editorStyles.actionRow}>
            <Link href="/builder">
              <Button intent="ghost" size="small">
                <LuArrowLeft size={16} strokeWidth={1.5} />
                Portfolio builder
              </Button>
            </Link>
            <Button
              intent="secondary"
              onClick={() => {
                if (!rendered) return
                downloadText(`${fileBase}.tex`, rendered.tex, "application/x-tex")
                flash("LaTeX downloaded")
              }}
              size="small"
            >
              <LuDownload size={16} strokeWidth={1.5} />
              Download .tex
            </Button>
            <Button
              disabled={busy || portfolio === null}
              intent="primary"
              onClick={downloadPdf}
              size="small"
            >
              <LuDownload size={16} strokeWidth={1.5} />
              {busy ? "Preparing" : "Download PDF"}
            </Button>
          </div>
        </div>
      </div>

      <div className={editorStyles.layout}>
        <div className={editorStyles.side}>
          <div>
            <h1 className={editorStyles.heading}>Your resume, typeset</h1>
            <p className={editorStyles.lead}>
              The same data as your portfolio, laid out as a document. Edit the YAML on the left, and the
              sheet on the right rebuilds as you type.
            </p>
          </div>

          <div className={editorStyles.panel}>
            <p className={editorStyles.panelHeading}>Layout</p>
            <p className={editorStyles.panelNote}>
              Ten layouts. Six read cleanly in a parser; two are two-column and reorder it, and say so.
            </p>
            <div className={editorStyles.layoutList}>
              {resumeLayoutSpecs.map((entry) => (
                <button
                  className={entry.id === layoutId ? editorStyles.layoutButtonActive : editorStyles.layoutButton}
                  key={entry.id}
                  onClick={() => setLayoutId(entry.id)}
                  type="button"
                >
                  <span className={editorStyles.layoutName}>{entry.name}</span>
                  <span className={editorStyles.layoutMeta}>
                    {entry.columns === 2 ? "Two columns · reorders in a parser" : "One column"}
                  </span>
                </button>
              ))}
            </div>
            <div className={editorStyles.configRow}>
              <span className={editorStyles.configLabel}>Density</span>
              <Button
                intent={skin.density === "comfortable" ? "secondary" : "ghost"}
                onClick={() => setSkin((current) => ({ ...current, density: "comfortable" }))}
                size="small"
              >
                Comfortable
              </Button>
              <Button
                intent={skin.density === "compact" ? "secondary" : "ghost"}
                onClick={() => setSkin((current) => ({ ...current, density: "compact" }))}
                size="small"
              >
                Compact
              </Button>
              <span className={editorStyles.configLabel}>Accent</span>
              <Button
                intent={skin.accent === "blue" ? "secondary" : "ghost"}
                onClick={() => setSkin((current) => ({ ...current, accent: "blue" }))}
                size="small"
              >
                Blue
              </Button>
              <Button
                intent={skin.accent === "ink" ? "secondary" : "ghost"}
                onClick={() => setSkin((current) => ({ ...current, accent: "ink" }))}
                size="small"
              >
                Ink
              </Button>
            </div>
          </div>

          <div className={editorStyles.panel}>
            <div className={editorStyles.panelHead}>
              <p className={editorStyles.panelHeading}>Your data</p>
              <p className={portfolio === null ? editorStyles.statusBad : editorStyles.statusOk}>
                {portfolio === null ? (
                  `${parsed.ok ? 0 : parsed.issues.length} thing${parsed.issues.length === 1 ? "" : "s"} to fix`
                ) : (
                  <span className={editorStyles.validRow}>
                    <LuCheck size={14} strokeWidth={2} /> Valid
                  </span>
                )}
              </p>
            </div>
            <div className={editorStyles.sourceFrame}>
              <YamlSource onChange={setDraft} value={draft} />
            </div>
          </div>
        </div>

        <div className={editorStyles.side}>
          <div className={editorStyles.sheetPane}>
            <div className={editorStyles.sheetHead}>
              <span className={editorStyles.sheetName}>{spec.name}</span>
              {spec.atsClean ? null : (
                <span className={editorStyles.sheetWarning}>
                  <LuTriangleAlert size={13} strokeWidth={1.5} className={editorStyles.warningMark} />
                  Two columns reorder in a parser
                </span>
              )}
            </div>
            <div className={editorStyles.sheetBody}>
              {rendered ? (
                <DocumentSheet layout={rendered.layout} skin={skin} spec={spec} />
              ) : (
                <p className={editorStyles.panelNote}>Fix the YAML and the sheet comes back.</p>
              )}
            </div>
          </div>

          {visibleReport ? (
            <div className={editorStyles.ats}>
              <ExtractedTextPane mocked={!compiled} report={visibleReport} />
            </div>
          ) : null}
        </div>
      </div>

      {toast ? <div className={editorStyles.toast}>{toast}</div> : null}
    </div>
  )
}