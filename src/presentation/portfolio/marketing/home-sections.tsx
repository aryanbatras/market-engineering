"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@presentation/core/design/cn"
import { faqStyles, introStyles } from "./home-sections.styles"

const faqs = [
  {
    question: "Do I need to know how to code?",
    answer:
      "No. Copy your resume text, paste it into any AI with our prompt, and paste the YAML back here.",
  },
  {
    question: "What if I only have a PDF?",
    answer:
      "Still fine. Open the PDF, copy the text, run it through the prompt. We never see the file.",
  },
  {
    question: "Can I keep the source?",
    answer:
      "No. Templates stay on our servers, which is the only reason one dollar a month keeps working in year two.",
  },
  {
    question: "Who can see it?",
    answer:
      "Anyone with the link. You decide whether it is listed anywhere, and you can unpublish it in one click.",
  },
  {
    question: "What happens after I graduate?",
    answer:
      "Nothing changes. Your URL does not expire and the free tier keeps working.",
  },
  {
    question: "What if I get it wrong?",
    answer:
      "Every publish keeps a revision, so a bad paste is one click to undo.",
  },
]

export const IntroSection = () => (
  <div className={introStyles.column}>
    <p className={introStyles.first}>Most engineering students have work worth showing, and no way to show it.</p>
  </div>
)

export const FaqSection = () => {
  const [active, setActive] = useState(0)
  const lastScrolled = useRef(0)
  const selected = faqs[active]

  useEffect(() => {
    const onScroll = () => {
      const now = window.scrollY
      const delta = now - lastScrolled.current
      if (delta < 40) return
      lastScrolled.current = now
      if (delta > 0) setActive((current) => Math.min(current + 1, faqs.length - 1))
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
      <div className={faqStyles.list}>
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
            <span aria-hidden className={index === active ? faqStyles.dotActive : faqStyles.dot} />
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