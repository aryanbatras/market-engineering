import Link from "next/link"
import { wordmarkStyles } from "./wordmark.styles"
import { cn } from "@presentation/design/cn"

type WordmarkProps = {
  size?: "inline" | "display"
  className?: string
}

export const Wordmark = ({ size = "inline", className }: WordmarkProps) => {
  const base = size === "display" ? wordmarkStyles.markBig : wordmarkStyles.root
  return (
    <Link className={cn(base, className)} href="/">
      <span className={wordmarkStyles.mark}>Market</span>
      <span className={wordmarkStyles.markText}>Engineering</span>
    </Link>
  )
}
