"use client"

import { useEffect, useRef, useState } from "react"
import { LuCheck } from "react-icons/lu"
import { cn } from "@presentation/design/cn"
import { Reveal } from "@presentation/motion/reveal"
import { faqStyles, introStyles, showcaseStyles, stepsStyles } from "./home-sections.styles"

const showcaseRows = [
  { title: "Ledger for a canteen that runs on IOU", meta: "TypeScript · PostgreSQL · Next.js" },
  { title: "Rate limiter that survived load testing", meta: "Go · Redis · Docker" },
  { title: "Query cost dashboard", meta: "Python · ClickHouse" },
]

export const ShowcaseSection = () => {
  const [checked, setChecked] = useState<string[]>([])

  const toggle = (title: string) => {
    setChecked((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    )
  }

  return (
    <div className={showcaseStyles.layout}>
      <div className={showcaseStyles.labelColumn}>
        <h2 className={showcaseStyles.title}>The editor is the demo</h2>
        <p className={showcaseStyles.body}>
          Tick a project and the finished page updates. This is the real component, running on this page.
        </p>
      </div>
      <div className={showcaseStyles.fragmentColumn}>
        <div className={showcaseStyles.states}>
          {["As it arrives", "While you edit", "As it publishes"].map((state, index) => (
            <div key={state}>
              <p className={showcaseStyles.stateLabel}>{state}</p>
              <div className={showcaseStyles.fragment}>
                <div className={showcaseStyles.fragmentHead}>projects</div>
                <div className={showcaseStyles.fragmentBody} data-ui>
                  {showcaseRows.map((row, rowIndex) => {
                    const isInteractive = index === 1
                    const isChecked = checked.includes(row.title)
                    const isActive = isInteractive && rowIndex === 0

                    return (
                      <button
                        aria-pressed={isInteractive ? isChecked : undefined}
                        className={cn(
                          showcaseStyles.row,
                          isChecked && showcaseStyles.rowActive,
                          isInteractive ? showcaseStyles.rowInteractive : showcaseStyles.rowStatic,
                        )}
                        disabled={!isInteractive}
                        key={row.title}
                        onClick={() => {
                          if (isInteractive) toggle(row.title)
                        }}
                        type="button"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            showcaseStyles.box,
                            isChecked && showcaseStyles.boxOn,
                            !isInteractive && showcaseStyles.boxMuted,
                          )}
                        >
                          {isChecked ? (
                            <LuCheck className={showcaseStyles.boxCheck} size={12} strokeWidth={3} />
                          ) : null}
                        </span>
                        <span className={showcaseStyles.rowTitle}>{row.title}</span>
                        <span className={showcaseStyles.rowMeta}>{row.meta}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const faqs = [
  {
    question: "Do I need to know how to code?",
    answer:
      "No. Most people who land here cannot build a website. You paste your resume into any AI, it hands back YAML, you paste that here.",
  },
  {
    question: "What if my resume is a PDF and nothing else?",
    answer:
      "That still works. Copy the text out of the PDF, give it to any AI with our prompt, and paste what comes back. We do not store your file.",
  },
  {
    question: "Can I keep the source?",
    answer:
      "No, and that is the point. Templates stay on our servers. It is the only reason a one dollar subscription keeps working for you in year two.",
  },
  {
    question: "Who can see my portfolio?",
    answer:
      "Anyone with the link. You decide whether it is listed anywhere, and you can take it down whenever you want.",
  },
  {
    question: "What happens when I graduate?",
    answer:
      "You keep it. Update it, change the template, change the handle. Your URL does not expire, and the free tier keeps working.",
  },
  {
    question: "What if I get it wrong?",
    answer:
      "You fix it. Every publish keeps a revision, so a bad paste is one click to undo rather than a lost afternoon.",
  },
]

export const FaqSection = () => {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement | null>(null)
  const lastScrolled = useRef(0)
  const selected = faqs[active]

  useEffect(() => {
    const node = listRef.current
    if (!node) return

    const onScroll = () => {
      const now = window.scrollY
      const delta = now - lastScrolled.current
      if (Math.abs(delta) < 40) return
      if (delta < 0) return

      lastScrolled.current = now
      setActive((current) => Math.min(current + 1, faqs.length - 1))
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const select = (index: number) => {
    setActive(index)
    lastScrolled.current = window.scrollY
  }

  return (
    <div className={faqStyles.layout}>
      <div className={faqStyles.list} ref={listRef}>
        <p className={faqStyles.heading}>Questions</p>
        {faqs.map((item, index) => (
          <button
            className={cn(
              index === active ? faqStyles.questionActive : faqStyles.question,
              index === active && faqStyles.questionOn,
            )}
            key={item.question}
            onClick={() => select(index)}
            onFocus={() => select(index)}
            type="button"
          >
            <span aria-hidden className={cn(index === active ? faqStyles.dotActive : faqStyles.dot)} />
            <span>{item.question}</span>
          </button>
        ))}
      </div>
      <div className={faqStyles.pane}>
        <p className={faqStyles.answer} key={active}>
          {selected?.answer ?? ""}
        </p>
      </div>
    </div>
  )
}

export const IntroSection = () => (
  <div className={introStyles.column}>
    <p className={introStyles.first}>
      Most engineering students have work worth showing, and no way to show it.
    </p>
    <p className={introStyles.body}>
      Not because they cannot write code. Because nobody taught them that presenting the work is a
      separate skill, and it is one that decides who gets the interview.
    </p>
    <p className={introStyles.body}>
      So the advice they get is &ldquo;make a portfolio&rdquo;. Which is two assumptions at once: that you
      know what a good one looks like, and that you can build one. Both are wrong, usually.
    </p>
    <p className={introStyles.body}>
      We removed both assumptions. You bring what you already have. We handle the rest.
    </p>
  </div>
)

const steps = [
  {
    clause: "Paste it, or connect GitHub.",
    rows: [{ title: "portfolio.yaml", value: "waiting", on: false }],
  },
  {
    clause: "We check every field.",
    rows: [
      { title: "name", value: "Your Name", on: true },
      { title: "headline", value: "Backend engineer", on: true },
    ],
  },
  {
    clause: "You pick a template.",
    rows: [
      { title: "template", value: "Classic", on: true },
      { title: "projects", value: "5 found", on: true },
      { title: "skills", value: "8 found", on: false },
    ],
  },
  {
    clause: "It goes live at your URL.",
    rows: [{ title: "/p/yourname", value: "live", on: true }],
  },
]

const stepFields = [stepsStyles.fieldOne, stepsStyles.fieldTwo, stepsStyles.fieldThree, stepsStyles.fieldFour]

export const StepsSection = () => (
  <div className={stepsStyles.grid}>
    {steps.map((step, index) => {
      const dark = index === 3
      return (
        <Reveal
          className={cn(stepsStyles.field, stepFields[index])}
          delay={index * 70}
          key={step.clause}
        >
          <div>
            <p className={dark ? stepsStyles.indexOnDark : stepsStyles.index}>Step {index + 1}</p>
            <p className={dark ? stepsStyles.clauseOnDark : stepsStyles.clause}>{step.clause}</p>
          </div>
          <div className={dark ? stepsStyles.cardOnDark : stepsStyles.card} data-ui>
            {step.rows.map((row) => (
              <div key={row.title}>
                <p className={dark ? stepsStyles.cardTitleOnDark : stepsStyles.cardTitle}>{row.title}</p>
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
        </Reveal>
      )
    })}
  </div>
)
