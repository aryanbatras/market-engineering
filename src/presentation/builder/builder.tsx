"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import { LuArrowLeft, LuArrowRight, LuDownload } from "react-icons/lu"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import type { TemplateConfig } from "@application/portfolio/portfolio.schema"
import { builderYaml } from "@application/portfolio/hero-yaml"
import { importPrompt } from "@application/portfolio/portfolio-copy"
import { registry } from "@presentation/templates/registry"
import { slugify } from "@application/portfolio/slugify"
import { portfolioUrl, siteConfig } from "@application/site/site-config"
import { useSession } from "@application/auth/use-session"
import { portfolioRepository } from "@infrastructure/persistence/resolve-portfolio-repository"
import { Button } from "@presentation/design/button"
import { Wordmark } from "@presentation/marketing/wordmark"
import { builderStyles } from "./builder.styles"
import { YamlSource } from "./yaml-source"
import { TemplatePicker } from "./template-picker"
import { LiveTemplatePreview } from "./template-gallery"

const defaultConfig: TemplateConfig = { accent: "blue", density: "comfortable", dark: false }

type BuilderStep = "template" | "edit" | "published"

const BuilderInner = () => {
  const router = useRouter()
  const params = useSearchParams()
  const [draft, setDraft] = useState(builderYaml)
  const [handle, setHandle] = useState("nainakumari")
  const [toast, setToast] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { session, loading: sessionLoading, signIn, isMocked } = useSession()

  const requested = params.get("template")
  const templateId = requested ?? "classic"
  const step: BuilderStep = requested ? "edit" : "template"

  const result = useMemo(() => parsePortfolioText(draft), [draft])
  const portfolio = result.ok ? result.data : null

  const chooseTemplate = (id: string) => router.push(`/builder?template=${id}`)

  const handleIsValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle) && handle.length >= 3

  const suggestedHandle = result.ok ? slugify(result.data.identity.name) : "yourname"

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const publish = async () => {
    if (!portfolio || !session) return
    setBusy(true)
    try {
      await portfolioRepository.save({
        handle,
        templateId,
        config: defaultConfig,
        data: portfolio,
        visibility: "public",
        userId: session.user.id,
      })
      router.push("/dashboard")
    } finally {
      setBusy(false)
    }
  }

  const download = () => {
    const blob = new Blob([draft], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${handle || "portfolio"}.yaml`
    anchor.click()
    URL.revokeObjectURL(url)
    flash("YAML downloaded")
  }

  const currentMeta = registry.find((entry) => entry.meta.id === templateId)?.meta

  return (
    <div className={builderStyles.shell}>
      <div className={builderStyles.bar}>
        <div className={builderStyles.barInner}>
          <div className={builderStyles.barLeft}>
            <Wordmark />
            <span className={builderStyles.crumb}>
              {step === "template" ? "Choose a template" : currentMeta?.name}
            </span>
          </div>
          <div className={builderStyles.actionRow}>
            <Button intent="ghost" onClick={download} size="small">
              <LuDownload size={16} strokeWidth={1.5} />
              Export
            </Button>
            {session ? (
              <Button disabled={busy} intent="primary" onClick={() => void publish()} size="small">
                Publish
              </Button>
            ) : (
              <Button
                disabled={sessionLoading}
                intent="primary"
                onClick={() => void signIn()}
                size="small"
              >
                {isMocked ? "Sign in to publish" : "Sign in"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {step === "template" ? (
        <TemplatePicker onSelect={chooseTemplate} />
      ) : (
        <div className={builderStyles.layout}>
          <div className={builderStyles.panel}>
            <div>
              <p className={builderStyles.panelHeading}>Your data</p>
              <p className={builderStyles.panelNote}>
                Paste YAML, or ask any AI to convert your resume with the prompt below.
              </p>
            </div>

            <YamlSource onChange={setDraft} value={draft} />

            <div className={builderStyles.statusRow}>
              {result.ok ? (
                <p className={builderStyles.statusOk}>Valid</p>
              ) : (
                <p className={builderStyles.statusBad}>
                  {result.issues.length} thing{result.issues.length === 1 ? "" : "s"} to fix
                </p>
              )}
              <Button intent="secondary" onClick={() => router.push("/builder")} size="small">
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
              <p className={builderStyles.panelNote}>{portfolioUrl(handle)}</p>
              <input
                aria-label="Handle"
                className={builderStyles.handleInput}
                onChange={(event) => setHandle(event.target.value)}
                value={handle}
              />
              <button
                className={builderStyles.suggest}
                onClick={() => setHandle(suggestedHandle)}
                type="button"
              >
                Use {suggestedHandle}
              </button>
              {handleIsValid ? (
                <p className={builderStyles.handleOk}>Looks available</p>
              ) : (
                <p className={builderStyles.handleBad}>Lowercase letters, numbers, single hyphens.</p>
              )}
            </div>

            <div className={builderStyles.promptBox}>
              <p className={builderStyles.panelHeading}>Make it a resume too</p>
              <p className={builderStyles.promptBody}>
                The same data typesets as a document. Ten layouts, and you can see what a
                recruiter&apos;s software actually reads before you send it anywhere.
              </p>
              <div className={builderStyles.gapTop}>
                <Link href="/resume">
                  <Button intent="secondary" size="small">
                    Open the resume editor
                  </Button>
                </Link>
              </div>
            </div>

            <div className={builderStyles.promptBox}>
              <p className={builderStyles.panelHeading}>Convert a resume</p>
              <pre className={builderStyles.promptText}>{importPrompt.slice(0, 300)}…</pre>
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
              <span>{currentMeta?.name}</span>
              <Link className={builderStyles.previewLink} href={`/p/${handle}`}>
                Preview
                <LuArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
            <div className={builderStyles.previewScroll}>
              {currentMeta ? <LiveTemplatePreview fill meta={currentMeta} /> : null}
            </div>
          </div>
        </div>
      )}

      {toast ? <div className={builderStyles.toast}>{toast}</div> : null}
    </div>
  )
}

export const Builder = () => (
  <Suspense fallback={<div className={builderStyles.loading}>Loading the builder…</div>}>
    <BuilderInner />
  </Suspense>
)