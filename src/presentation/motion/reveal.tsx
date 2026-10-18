"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"
import { usePrefersReducedMotion } from "@presentation/design/use-prefers-reduced-motion"

type RevealProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
  distance?: number
}

export const Reveal = ({ children, className, as: Tag = "div", delay = 0, distance = 24 }: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <Tag
      className={className}
      ref={ref}
      style={
        shown
          ? { animation: "rise 0.5s cubic-bezier(0.22,1,0.36,1) both", animationDelay: `${delay}ms` }
          : reduced
            ? undefined
            : { opacity: 0 }
      }
    >
      {children}
    </Tag>
  )
}