"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { LuCheck, LuCopy, LuDownload, LuExternalLink } from "react-icons/lu"
import { stringify } from "yaml"
import { parsePortfolioText, firstIssue } from "@application/portfolio/parse-portfolio"
import type { Portfolio, TemplateConfig } from "@application/portfolio/portfolio.schema"
import { samplePortfolio } from "@application/portfolio/sample-portfolio"
import { importPrompt } from "@application/portfolio/portfolio-copy"
import { registry } from "@presentation/templates/registry"
import type { TemplateModule } from "@presentation/templates/types"
import { cn } from "@presentation/design/cn"
import { Button } from "@presentation/design/button"
import { builderStyles } from "./builder.styles"

const seedText = stringify(samplePortfolio, { lineWidth: 0 })

const defaultConfig: TemplateConfig = { accent: "blue", density: "comfortable", dark: false }

const slugFrom = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30)

const TemplatePreview = ({
  templateId,
  portfolio,
  config,
}: {
  templateId: string
  portfolio: Portfolio
  config: TemplateConfig
}) => {
  const [Component, setComponent] = useState<TemplateModule["Template"] | null>(null)

  useEffect(() => {
    let active = true
    void registry
      .find((entry) => entry.meta.id === templateId)
      ?.load()
      .then((module) => {
        if (active && module) setComponent(() => module.Template)
      })
    return () => {
      active = false
    }
  }, [templateId])

  if (!Component) {
    return <div className={builderStyles.previewBody} />
  }

  return <Component config={config} data={portfolio} showAttribution={true} />
}

export const Builder = () => {
  const [text, setText] = useState(seedText)
  const [templateId, setTemplateId] = useState("classic")
  const [handle, setHandle] = useState("ananya")
  const [toast, setToast] = useState<string | null>(null)

  const result = useMemo(() => parsePortfolioText(text), [text])
  const portfolio = result.ok ? result.data : null
  const issue = firstIssue(result)

  const handleIsValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle) && handle.length >= 3

  const flash = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }, [])

  const handleNameChange = (value: string) => {
    setHandle(value)
  }

  const publish = () => {
    if (!portfolio || !handleIsValid) return
    flash("Published. Your URL is ready.")
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/p/${handle}`
    try {
      await navigator.clipboard.writeText(url)
      flash("Link copied")
    } catch {
      flash(url)
    }
  }

  const download = () => {
    const blob = new Blob([text], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${handle || "portfolio"}.yaml`
    anchor.click()
    URL.revokeObjectURL(url)
    flash("YAML downloaded")
  }

  return (
    <div className={builderStyles.shell}>
      <div className={builderStyles.bar}>
        <div className={builderStyles.barInner}>
          <Link className={builderStyles.wordmark} href="/">
            Market Engineering
          </Link>
          <div className={builderStyles.actionRow}>
            <Button intent="ghost" onClick={download} size="small">
              <LuDownload size={16} strokeWidth={1.5} />
              YAML
            </Button>
            <Button intent="ghost" onClick={() => void copyLink()} size="small">
              <LuCopy size={16} strokeWidth={1.5} />
              Copy link
            </Button>
            <Button intent="accent" onClick={publish} size="small">
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className={builderStyles.layout}>
        <div className={builderStyles.panel}>
          <div>
            <p className={builderStyles.panelHeading}>Your data</p>
            <p className={builderStyles.panelNote}>
              Paste YAML, or ask any AI to convert your resume using the prompt below.
            </p>
          </div>

          <textarea
            aria-label="Portfolio YAML"
            className={builderStyles.editor}
            onChange={(event) => setText(event.target.value)}
            spellCheck={false}
            value={text}
          />

          <div className={builderStyles.statusRow}>
            {result.ok ? (
              <p className={builderStyles.statusOk}>
                <LuCheck size={14} strokeWidth={2} />
                Valid
              </p>
            ) : (
              <p className={builderStyles.statusBad}>
                {result.issues.length} thing{result.issues.length === 1 ? "" : "s"} to fix
              </p>
            )}
            <Button intent="quiet" onClick={() => setText(seedText)} size="small">
              Reset to sample
            </Button>
          </div>

          {!result.ok && issue ? (
            <ul className={builderStyles.issueList}>
              {result.issues.slice(0, 4).map((entry) => (
                <li className={builderStyles.issue} key={`${entry.field}-${entry.message}`}>
                  <span className={builderStyles.issueField}>{entry.field}</span> — {entry.message}
                </li>
              ))}
            </ul>
          ) : null}

          <div className={builderStyles.handleRow}>
            <p className={builderStyles.panelHeading}>Your URL</p>
            <p className={builderStyles.panelNote}>
              marketengineering.dev/p/{handle || "your-handle"}
            </p>
            <input
              aria-label="Handle"
              className={builderStyles.handleInput}
              onChange={(event) => handleNameChange(event.target.value)}
              value={handle}
            />
            {handle.length === 0 ? (
              <p className={builderStyles.panelNote}>We will suggest one from your name.</p>
            ) : handleIsValid ? (
              <p className={builderStyles.handleOk}>Available</p>
            ) : (
              <p className={builderStyles.handleBad}>Lowercase letters, numbers, single hyphens.</p>
            )}
          </div>

          <div className={builderStyles.promptBox}>
            <p className={builderStyles.panelHeading}>Need to convert a resume?</p>
            <p className={builderStyles.promptBody}>
              Copy this prompt into ChatGPT, Gemini, or whatever you already use.
            </p>
            <pre className={builderStyles.promptText}>{importPrompt.slice(0, 420)}…</pre>
            <div className={builderStyles.gapTop}>
              <Button
                intent="secondary"
                onClick={() => {
                  void navigator.clipboard.writeText(importPrompt)
                  flash("Prompt copied")
                }}
                size="small"
              >
                <LuCopy size={16} strokeWidth={1.5} />
                Copy the prompt
              </Button>
            </div>
          </div>

          <div>
            <p className={builderStyles.panelHeading}>Template</p>
            <div className={cn(builderStyles.templateRow, builderStyles.gapTop)}>
              {registry.map((entry) => (
                <button
                  className={cn(
                    builderStyles.templateButton,
                    templateId === entry.meta.id && builderStyles.templateButtonActive,
                  )}
                  key={entry.meta.id}
                  onClick={() => setTemplateId(entry.meta.id)}
                  type="button"
                >
                  <span className={builderStyles.templateName}>
                    {entry.meta.name}
                    {entry.meta.freeTier ? null : (
                      <span className={builderStyles.templateTag}> Pro</span>
                    )}
                  </span>
                  <span className={builderStyles.templateSummary}>{entry.meta.summary}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={builderStyles.previewFrame}>
          <div className={builderStyles.previewHead}>
            <span>Live preview</span>
            <Link className={builderStyles.linkOut} href={`/p/${handle || "you"}`}>
              Open page
              <LuExternalLink size={13} strokeWidth={1.5} />
            </Link>
          </div>
          <div className={builderStyles.previewScroll}>
            <div className={builderStyles.previewBody}>
              {portfolio ? (
                <TemplatePreview config={defaultConfig} portfolio={portfolio} templateId={templateId} />
              ) : (
                <p className={builderStyles.panelNote}>Fix the errors and the preview appears here.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast ? <div className={builderStyles.toast}>{toast}</div> : null}
    </div>
  )
}