"use client"

import { useEffect, useRef, type RefObject } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

type ScrollDepthOptions = {
  heroRef: RefObject<HTMLElement | null>
  auraRef: RefObject<HTMLDivElement | null>
}

export const useScrollDepth = ({ heroRef, auraRef }: ScrollDepthOptions): void => {
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const hero = heroRef.current
    const aura = auraRef.current
    if (!hero) return

    const context = gsap.context(() => {
      gsap.fromTo(
        hero.querySelectorAll("[data-line]"),
        { yPercent: 108 },
        { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.08, delay: 0.1 },
      )

      if (aura) {
        gsap.to(aura, {
          yPercent: 24,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
        })
      }

      gsap.to(hero, {
        yPercent: 18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
      })
    }, hero)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("resize", refresh)
    cleanupRef.current = () => window.removeEventListener("resize", refresh)

    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
      context.revert()
    }
  }, [heroRef, auraRef])
}
