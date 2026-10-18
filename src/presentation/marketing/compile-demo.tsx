"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePrefersReducedMotion } from "@presentation/design/use-prefers-reduced-motion"
import { LuCheck } from "react-icons/lu"
import { parsePortfolioText } from "@application/portfolio/parse-portfolio"
import type { Portfolio } from "@application/portfolio/portfolio.schema"
import { fullCompileScript } from "@application/portfolio/compile-script"
import { cn } from "@presentation/design/cn"
import { compileStyles } from "./compile-demo.styles"

const lineDelay = 90
const holdMs = 2600

const scriptLength = fullCompileScript.length

const PortfolioFragment = ({ data }: { data: Portfolio }) => (
  <div className={compileStyles.previewBody}>
    <div>
      <p className={compileStyles.previewName}>{data.identity.name}</p>
      {data.identity.headline ? (
        <p className={compileStyles.previewHeadline}>{data.identity.headline}</p>
      ) : null}
      {data.identity.location ? <p className={compileStyles.previewMeta}>{data.identity.location}</p> : null}
    </div>
    <div>
      {data.projects.slice(0, 2).map((project) => (
        <div className={compileStyles.previewProject} key={project.name}>
          <p className={compileStyles.previewProjectName}>{project.name}</p>
          {project.description ? (
            <p className={compileStyles.previewProjectBody}>{project.description}</p>
          ) : null}
          {project.tech.length > 0 ? (
            <div className={compileStyles.previewTags}>
              {project.tech.slice(0, 3).map((tech) => (
                <span className={compileStyles.previewTag} key={tech}>
                  {tech}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
)

export const CompileDemo = () => {
  const [revealed, setRevealed] = useState(12)
  const [paused, setPaused] = useState(false)
  const frameRef = useRef<number | null>(null)

  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced || paused) return

    const timer = window.setTimeout(() => {
      setRevealed((current) => (current >= scriptLength ? 0 : current + 1))
    }, lineDelay)

    return () => window.clearTimeout(timer)
  }, [revealed, paused, prefersReduced])

  useEffect(() => {
    if (!prefersReduced || revealed === scriptLength) return
    const timer = window.setTimeout(() => setRevealed(scriptLength), 0)
    return () => window.clearTimeout(timer)
  }, [prefersReduced, revealed])

  const visible = useMemo(() => fullCompileScript.slice(0, revealed), [revealed])

  const text = useMemo(() => {
    const joined = visible.join("\n")
    const last = visible[visible.length - 1] ?? ""
    return { joined, isComplete: revealed >= scriptLength && last.trim().length > 0 }
  }, [visible, revealed])

  const parsed = useMemo(() => {
    if (text.joined.trim().length === 0) return null
    const result = parsePortfolioText(text.joined)
    return result.ok ? result.data : null
  }, [text.joined])

  return (
    <div
      className={compileStyles.root}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={compileStyles.split}>
        <div className={compileStyles.editorPane}>
          <div className={compileStyles.editorHead}>
            <span>portfolio.yaml</span>
            <span>{revealed}/{scriptLength}</span>
          </div>
          <div className={compileStyles.editor} data-ui>
            <pre className={compileStyles.codeLine}>
              {text.joined}
              <span className={compileStyles.caret} />
            </pre>
          </div>
          <p className={cn(compileStyles.status, parsed ? compileStyles.statusOk : compileStyles.statusPending)}>
            {parsed ? (
              <>
                <LuCheck aria-hidden size={14} strokeWidth={2} />
                Valid against the schema
              </>
            ) : (
              "Validating…"
            )}
          </p>
        </div>

        <div className={compileStyles.previewPane}>
          <div className={compileStyles.previewSpacer} />
          {parsed ? (
            <PortfolioFragment data={parsed} />
          ) : (
            <div className={compileStyles.previewBody}>
              <div className={compileStyles.previewSkeleton}>
                <p className={compileStyles.previewName}>Your name</p>
                <p className={compileStyles.previewHeadline}>One line about what you build</p>
              </div>
              <div className={compileStyles.previewSkeleton}>
                <p className={compileStyles.previewMeta}>your first project</p>
              </div>
            </div>
          )}
          <p className={compileStyles.previewHead}>
            marketengineering.dev/p/{parsed?.meta?.handle ?? "you"}
          </p>
        </div>
      </div>
    </div>
  )
}