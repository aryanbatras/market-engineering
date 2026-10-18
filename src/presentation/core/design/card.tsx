import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "./cn"
import { cardClasses, cardLiftClasses } from "./card.styles"

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  variant?: "sunken" | "quiet"
  interactive?: boolean
}

export const Card = ({ children, variant = "sunken", interactive = false, className, ...rest }: CardProps) => (
  <div
    className={cn(variant === "sunken" ? cardClasses.root : cardClasses.quiet, className)}
    {...rest}
  >
    {children}
  </div>
)

type CardBodyProps = {
  children: ReactNode
  interactive?: boolean
  className?: string
}

export const CardBody = ({ children, interactive = false, className }: CardBodyProps) => (
  <div className={cn(cardClasses.inner, interactive && cardLiftClasses.interactive, className)}>
    {children}
  </div>
)
