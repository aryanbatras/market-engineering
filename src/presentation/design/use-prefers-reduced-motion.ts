"use client"

import { useSyncExternalStore } from "react"

const query = "(prefers-reduced-motion: reduce)"

const subscribe = (onChange: () => void) => {
  if (typeof window === "undefined") return () => undefined
  const media = window.matchMedia(query)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

const getSnapshot = () => {
  if (typeof window === "undefined") return false
  return window.matchMedia(query).matches
}

const getServerSnapshot = () => false

export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
