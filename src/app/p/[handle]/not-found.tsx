import Link from "next/link"
import { Button } from "@presentation/core/design/button"
import { cn } from "@presentation/core/design/cn"

const notFoundStyles = {
  root: "flex min-h-dvh flex-col items-start justify-center px-5 md:px-8",
  inner: "max-w-[42ch]",
  kicker: "text-small text-ink-45",
  title: "text-title text-ink mt-6",
  body: "text-body text-ink-70 mt-6",
  action: "mt-10 flex flex-wrap items-center gap-6",
  link: "text-small text-ink-70 underline underline-offset-4",
} as const

const PortfolioNotFound = () => (
  <div className={notFoundStyles.root}>
    <div className={cn(notFoundStyles.inner)}>
      <p className={notFoundStyles.kicker}>404</p>
      <h1 className={notFoundStyles.title}>Nobody has claimed this one yet</h1>
      <p className={notFoundStyles.body}>
        This page does not exist, or the person who made it took it down. If that second one is you, your
        dashboard still has it.
      </p>
      <div className={notFoundStyles.action}>
        <Link href="/builder">
          <Button intent="primary">Build yours</Button>
        </Link>
        <Link className={notFoundStyles.link} href="/">
          Back to the start
        </Link>
      </div>
    </div>
  </div>
)

export default PortfolioNotFound
