import type { ReactNode } from "react"
import { LuHeart } from "react-icons/lu"
import { cn } from "./cn"
import { badgeClasses } from "./badge.styles"

type ChipProps = {
  children: ReactNode
  accent?: boolean
  className?: string
}

export const Chip = ({ children, accent = false, className }: ChipProps) => (
  <span className={cn(accent ? badgeClasses.chipAccent : badgeClasses.chip, className)}>{children}</span>
)

type AttributionProps = {
  label?: string
  className?: string
}

export const MadeWithLove = ({ label = "Made with love", className }: AttributionProps) => (
  <span className={cn(badgeClasses.attribution, className)}>
    <span>{label}</span>
    <LuHeart aria-hidden size={14} strokeWidth={1.5} />
  </span>
)
