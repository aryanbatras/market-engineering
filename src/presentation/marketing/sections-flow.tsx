"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { LuCheck } from "react-icons/lu"
import { cn } from "@presentation/design/cn"
import { usePrefersReducedMotion } from "@presentation/design/use-prefers-reduced-motion"
import { showcaseStyles, stepsStyles } from "./home-sections.styles"

const steps = [
  {
    clause: "Paste it, or connect GitHub.",
    rows: [
      { label: "portfolio.yaml", value: "112 lines", on: false },
      { label: "status", value: "valid", on: false },
    ],
  },
  {
    clause: "Every field is checked.",
    rows: [
      { label: "name", value: "Your Name", on: true },
      { label: "headline", value: "Backend engineer", on: true },
      { label: "projects", value: "5 parsed", on: true },
    ],
  },
  {
    clause: "Pick a template.",
    rows: [
      { label: "Classic", value: "selected", on: true },
      { label: "skills", value: "10 grouped", on: true },
      { label: "handle", value: "yourname", on: true },
    ],
  },
  {
    clause: "It goes live at your URL.",
    rows: [
      { label: "standout.dev/p/yourname", value: "live", on: true },
    ],
  },
]

const stepFields = [stepsStyles.fieldOne, stepsStyles.fieldTwo, stepsStyles.fieldThree, stepsStyles.fieldFour]

export const StepsSection = () => (
  <div className={stepsStyles.grid}>
    {steps.map((step, index) => {
      const dark = index === 3
      return (
        <div className={cn(stepsStyles.field, stepFields[index])} key={step.clause}>
          <div>
            <p className={dark ? stepsStyles.indexOnDark : stepsStyles.index}>Step {index + 1}</p>
            <p className={dark ? stepsStyles.clauseOnDark : stepsStyles.clause}>{step.clause}</p>
          </div>
          <div className={dark ? stepsStyles.cardOnDark : stepsStyles.card} data-ui>
            {step.rows.map((row) => (
              <div key={row.label}>
                <p className={dark ? stepsStyles.cardTitleOnDark : stepsStyles.cardTitle}>{row.label}</p>
                <p
                  className={
                    dark
                      ? row.on
                        ? stepsStyles.cardRowOnDarkOn
                        : stepsStyles.cardRowOnDark
                      : row.on
                        ? stepsStyles.cardRowOn
                        : stepsStyles.cardRow
                  }
                >
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    })}
  </div>
)

const projects = [
  { title: "Consensus log, from scratch", meta: "Go · gRPC · Raft" },
  { title: "Rate limiter that degrades correctly", meta: "Go · Redis" },
  { title: "Query cost dashboard", meta: "Python · ClickHouse" },
]

export const ShowcaseSection = () => {
  const scopeRef = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return

    if (reduced) {
      for (const box of scope.querySelectorAll("[data-box]")) box.setAttribute("data-on", "true")
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const boxes = gsap.utils.toArray<HTMLElement>("[data-box]")

      for (const box of boxes) {
        gsap.set(box, { scale: 0.6, opacity: 0.35 })
      }

      ScrollTrigger.create({
        trigger: scope,
        start: "top 72%",
        end: "bottom 62%",
        onEnter: () => setAll(scope, true),
        onEnterBack: () => setAll(scope, true),
      })

      gsap.to(boxes, {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: "back.out(2)",
        stagger: 0.14,
        scrollTrigger: {
          trigger: scope,
          start: "top 70%",
          end: "top 20%",
          scrub: true,
        },
      })

      const ticks = gsap.utils.toArray<HTMLElement>("[data-tick]")
      gsap.set(ticks, { autoAlpha: 0, scale: 0.4 })
      ScrollTrigger.create({
        trigger: scope,
        start: "top 58%",
        once: true,
        onEnter: () =>
          gsap.to(ticks, {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(3)",
            stagger: 0.16,
          }),
      })
    }, scope)

    return () => context.revert()
  }, [reduced])

  return (
    <div className={showcaseStyles.layout} ref={scopeRef}>
      <div className={showcaseStyles.labelColumn}>
        <h2 className={showcaseStyles.title}>The editor is the demo</h2>
        <p className={showcaseStyles.body}>
          This is the real component. Keep scrolling and the projects tick themselves in.
        </p>
      </div>
      <div className={showcaseStyles.fragmentColumn}>
        <div className={showcaseStyles.fragment} data-ui>
          <div className={showcaseStyles.fragmentHead}>projects</div>
          <div className={showcaseStyles.fragmentBody}>
            {projects.map((project) => (
              <div className={showcaseStyles.row} key={project.title}>
                <span className={showcaseStyles.box} data-box>
                  <LuCheck className={showcaseStyles.boxCheck} data-tick size={12} strokeWidth={3} />
                </span>
                <span className={showcaseStyles.rowTitle}>{project.title}</span>
                <span className={showcaseStyles.rowMeta}>{project.meta}</span>
              </div>
            ))}
          </div>
        </div>
        <p className={showcaseStyles.caption}>
          Featured projects, ticked in by scroll position. No click required.
        </p>
      </div>
    </div>
  )
}

const setAll = (scope: HTMLElement, on: boolean) => {
  for (const box of scope.querySelectorAll("[data-box]")) box.setAttribute("data-on", on ? "true" : "false")
}