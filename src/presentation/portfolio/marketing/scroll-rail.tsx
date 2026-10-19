"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePrefersReducedMotion } from "@presentation/core/design/use-prefers-reduced-motion"
import { railStyles } from "./rail.styles"

const steps = [
  {
    anchor: "work",
    when: "You already have this",
    title: "The work",
    body: "Commits, screenshots, internship notes, a hackathon that went nowhere. It exists. It is scattered across places nobody visits.",
    details: [
      { label: "Git history", value: "Already written" },
      { label: "Internship notes", value: "Already written" },
      { label: "The README nobody opens", value: "Already written" },
    ],
  },
  {
    anchor: "page",
    when: "This is the part that eats the evening",
    title: "The page",
    body: "Turning it into something a stranger reads in thirty seconds. No stack, no build step, no styling decisions. You fill in the fields and the layout is already decided.",
    details: [
      { label: "Coding", value: "None" },
      { label: "Layout choices", value: "None" },
      { label: "Deploy", value: "Automatic" },
    ],
  },
  {
    anchor: "link",
    when: "Before the deadline",
    title: "The link",
    body: "One address you paste into the application. It renders as a page, a social card and a PDF, because all three come out of the same file.",
    details: [
      { label: "Time", value: "Nine minutes" },
      { label: "Cost", value: "Free" },
      { label: "Revisions", value: "Unlimited" },
    ],
  },
]

export const ScrollRail = () => {
  const scope = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const node = scope.current
    if (!node || reduced) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      for (const step of node.querySelectorAll<HTMLElement>("[data-rail-step]")) {
        gsap.from(step, {
          y: 44,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: step, start: "top 88%", toggleActions: "play none none none" },
        })
      }
    }, node)

    return () => context.revert()
  }, [reduced])

  return (
    <div className={railStyles.root} ref={scope}>
      <p className={railStyles.head}>Three things, in the order they happen.</p>
      <p className={railStyles.note}>
        The work already exists. The page is what eats the evening. The link is what you send.
      </p>

      <div className={railStyles.track}>
        {steps.map((step, index) => (
          <div className={railStyles.step} data-rail-step key={step.title}>
            <span className={railStyles.marker}>
              <span className={index === 0 ? railStyles.markerCore : railStyles.markerRing} />
            </span>

            <div>
              <p className={railStyles.when}>{step.when}</p>
              <p className={railStyles.title}>{step.title}</p>
              <p className={railStyles.body}>{step.body}</p>
              <div className={railStyles.detail}>
                {step.details.map((detail) => (
                  <div className={railStyles.detailItem} key={detail.label}>
                    <span className={railStyles.detailLabel}>{detail.label}</span>
                    <span className={railStyles.detailValue}>{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className={railStyles.end}>
          <span className={railStyles.marker}>
            <span className={railStyles.markerCore} />
          </span>
          <p className={railStyles.endValue}>
            <span className={railStyles.endLabel}>Then</span> the recruiter opens it and you are already
            talking.
          </p>
        </div>
      </div>
    </div>
  )
}