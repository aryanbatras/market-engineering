"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePrefersReducedMotion } from "@presentation/core/design/use-prefers-reduced-motion"
import { scrollStyles } from "./scroll.styles"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  y?: number
  stagger?: number
}

export const ScrollReveal = ({ children, className, y = 28, stagger = 0.08 }: ScrollRevealProps) => {
  const scopeRef = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const scope = scopeRef.current
    if (!scope) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope)
      if (targets.length === 0) return

      gsap.set(targets, { autoAlpha: 0, y })

      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: scope,
          start: "top 85%",
          once: true,
        },
      })
    }, scope)

    return () => context.revert()
  }, [reduced, y, stagger])

  return (
    <div className={className} ref={scopeRef}>
      {children}
    </div>
  )
}

export const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const bar = barRef.current
    if (!bar) return

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      })
    })

    return () => context.revert()
  }, [reduced])

  if (reduced) return null

  return (
    <div aria-hidden className={scrollStyles.progressTrack}>
      <div className={scrollStyles.progressBar} ref={barRef} />
    </div>
  )
}