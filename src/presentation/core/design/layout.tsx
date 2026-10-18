import type { ElementType, ReactNode } from "react"
import { cn } from "./cn"
import { layoutClasses } from "./layout.styles"

type ShellProps = {
  children: ReactNode
  className?: string
  as?: ElementType
}

export const Page = ({ children, className }: ShellProps) => (
  <div className={cn(layoutClasses.page, className)}>{children}</div>
)

export const Shell = ({ children, className, as: Tag = "div" }: ShellProps) => (
  <Tag className={cn(layoutClasses.shell, className)}>{children}</Tag>
)

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
  spacing?: "full" | "tight" | "flush"
}

export const Section = ({ children, className, id, spacing = "full" }: SectionProps) => (
  <section
    id={id}
    className={cn(
      layoutClasses.section,
      spacing === "tight" && layoutClasses.sectionTight,
      spacing === "flush" && layoutClasses.sectionFlush,
      className,
    )}
  >
    {children}
  </section>
)
