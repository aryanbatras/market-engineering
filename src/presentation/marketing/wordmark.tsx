import Link from "next/link"
import { wordmarkStyles } from "./wordmark.styles"
import { cn } from "@presentation/design/cn"
import { siteConfig } from "@application/site/site-config"

type WordmarkProps = {
  size?: "inline" | "display"
  className?: string
}

export const Wordmark = ({ size = "inline", className }: WordmarkProps) => {
  const base = size === "display" ? wordmarkStyles.markBig : wordmarkStyles.root
  return (
    <Link className={cn(base, className)} href="/">
      <span className={wordmarkStyles.markText}>{siteConfig.name}</span>
    </Link>
  )
}
