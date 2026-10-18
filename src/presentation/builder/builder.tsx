"use client"

import { useEffect, useMemo, useState } from "react"
import { LuArrowLeft, LuArrowRight, LuDownload, LuExternalLink } from "react-icons/lu"
import { stringify } from "yaml"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import type { Portfolio, TemplateConfig } from "@application/portfolio/portfolio.schema"
import { samplePortfolio } from "@application/portfolio/sample-portfolio"
import { importPrompt } from "@application/portfolio/portfolio-copy"
import { registry } from "@presentation/templates/registry"
import { slugify } from "@application/portfolio/slugify"
import type { TemplateModule } from "@presentation/templates/types"
import { cn } from "@presentation/design/cn"
import { Button } from "@presentation/design/button"
import { builderStyles } from "./builder.styles"
import { YamlSource } from "./yaml-source"

const seedText = stringify(samplePortfolio, { lineWidth: 0 })

const defaultConfig: TemplateConfig = { accent: "blue", density: "comfortable", dark: false }

const TemplatePreview = ({
  templateId,
  portfolio,
}: {
  templateId: string
  portfolio: Portfolio
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

  if (!Component) return <div className={builderStyles.previewBody} />
  return <Component config={defaultConfig} data={portfolio} showAttribution={true} />
}

type BuilderStep = "template" | "edit" | "publish"

export const Builder = () => {
  const [step, setStep] = useState<BuilderStep>("template")
  const [templateId, setTemplateId] = useState("classic")
  const [text, setText] = useState(seedText)
  const [handle, setHandle] = useState(slugify("Your Name"))
  const [toast, setToast] = useState<string | null>(null)

  const result = useMemo(() => parsePortfolioText(text), [text])
  const portfolio = result.ok ? result.data : null

  const handleIsValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle) && handle.length >= 3

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
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
          <button
            className={builderStyles.wordmark}
            onClick={() => setStep("template")}
            type="button"
          >
            {step === "template" ? "Step 1 of 3 · Template" : "Step 2 of 3 · Your data"}
          </button>
          <div className={builderStyles.actionRow}>
            <Button intent="ghost" onClick={download} size="small">
              <LuDownload size={16} strokeWidth={1.5} />
              YAML
            </Button>
            {step === "edit" ? (
              <Button intent="primary" onClick={() => setStep("publish")} size="small">
                Publish
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {step === "template" ? (
        <div className={builderStyles.picker}>
          <h1 className={builderStyles.pickerTitle}>Pick a starting point</h1>
          <p className={builderStyles.pickerBody}>
            You can switch later without losing anything. Four are free, Immersive is Pro.
          </p>
          <div className={builderStyles.pickerGrid}>
            {registry.map((entry) => (
              <button
                className={cn(
                  builderStyles.pickerCard,
                  templateId === entry.meta.id && builderStyles.pickerCardActive,
                )}
                key={entry.meta.id}
                onClick={() => setTemplateId(entry.meta.id)}
                type="button"
              >
                <div className={builderStyles.pickerFrame}>
                  <div className={builderStyles.pickerScale}>
                    <TemplatePreview portfolio={previewFor()} templateId={entry.meta.id} />
                  </div>
                </div>
                <div className={builderStyles.pickerHead}>
                  <span className={builderStyles.pickerName}>{entry.meta.name}</span>
                  <span className={entry.meta.freeTier ? builderStyles.tag : builderStyles.tagPro}>
                    {entry.meta.freeTier ? "Free" : "Pro"}
                  </span>
                </div>
                <p className={builderStyles.pickerSummary}>{entry.meta.summary}</p>
              </button>
            ))}
          </div>
          <div className={builderStyles.pickerAction}>
            <Button intent="primary" onClick={() => setStep("edit")}>
              Use {registry.find((entry) => entry.meta.id === templateId)?.meta.name}
              <LuArrowRight size={17} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      ) : null}

      {step === "edit" ? (
        <div className={builderStyles.layout}>
          <div className={builderStyles.panel}>
            <div>
              <p className={builderStyles.panelHeading}>Your data</p>
              <p className={builderStyles.panelNote}>
                Paste YAML, or ask any AI to convert your resume using the prompt below.
              </p>
            </div>

            <YamlSource onChange={setText} value={text} />

            <div className={builderStyles.statusRow}>
              {result.ok ? (
                <p className={builderStyles.statusOk}>
                  Valid
                </p>
              ) : (
                <p className={builderStyles.statusBad}>
                  {result.issues.length} thing{result.issues.length === 1 ? "" : "s"} to fix
                </p>
              )}
              <Button intent="quiet" onClick={() => setStep("template")} size="small">
                <LuArrowLeft size={15} strokeWidth={1.5} />
                Change template
              </Button>
            </div>

            {!result.ok ? (
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
              <input
                aria-label="Handle"
                className={builderStyles.handleInput}
                onChange={(event) => setHandle(event.target.value)}
                value={handle}
              />
              {handleIsValid ? (
                <p className={builderStyles.handleOk}>Looks available</p>
              ) : (
                <p className={builderStyles.handleBad}>Lowercase letters, numbers, single hyphens.</p>
              )}
            </div>

            <div className={builderStyles.promptBox}>
              <p className={builderStyles.panelHeading}>Need to convert a resume?</p>
              <pre className={builderStyles.promptText}>{importPrompt.slice(0, 360)}…</pre>
              <div className={builderStyles.gapTop}>
                <Button
                  intent="secondary"
                  onClick={() => {
                    void navigator.clipboard.writeText(importPrompt)
                    flash("Prompt copied")
                  }}
                  size="small"
                >
                  Copy the prompt
                </Button>
              </div>
            </div>
          </div>

          <div className={builderStyles.previewFrame}>
            <div className={builderStyles.previewHead}>
              <span>Live preview · {registry.find((e) => e.meta.id === templateId)?.meta.name}</span>
            </div>
            <div className={builderStyles.previewScroll}>
              <div className={builderStyles.previewBody}>
                {portfolio ? (
                  <TemplatePreview portfolio={portfolio} templateId={templateId} />
                ) : (
                  <p className={builderStyles.panelNote}>Fix the errors and the preview appears here.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {step === "publish" ? (
        <div className={builderStyles.publish}>
          <h1 className={builderStyles.pickerTitle}>Sign in to publish</h1>
          <p className={builderStyles.pickerBody}>
            Your work is ready. We just need an account so your URL belongs to you and not to a stranger&apos;s
            browser.
          </p>
          <ul className={builderStyles.publishList}>
            <li>Your URL stays yours. Sign out, come back, it is still there.</li>
            <li>Your data exports on every plan, including free.</li>
            <li>Nothing is published until you publish it.</li>
          </ul>
          <div className={builderStyles.pickerAction}>
            <a href="/sign-in">
              <Button intent="primary">
                Continue with Google
                <LuExternalLink size={16} strokeWidth={1.5} />
              </Button>
            </a>
            <Button intent="quiet" onClick={() => setStep("edit")}>
              <LuArrowLeft size={16} strokeWidth={1.5} />
              Back to editing
            </Button>
          </div>
        </div>
      ) : null}

      {toast ? <div className={builderStyles.toast}>{toast}</div> : null}
    </div>
  )
}

const seedPortfolio = (): Portfolio => {
  const value = parsePortfolioText(seedText)
  return value.ok ? value.data : (samplePortfolio as Portfolio)
}

let previewCache: Portfolio | null = null

const previewFor = (): Portfolio => {
  previewCache ??= seedPortfolio()
  return previewCache
}