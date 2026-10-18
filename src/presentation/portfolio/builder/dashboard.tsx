"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LuArrowUpRight, LuDownload, LuRefreshCw } from "react-icons/lu"
import { useSession } from "@application/core/auth/use-session"
import { portfolioQueries } from "@composition/portfolio/portfolio-queries"
import { portfolioRepository } from "@infrastructure/portfolio/persistence/resolve-portfolio-repository"
import { portfolioUrl, siteConfig } from "@application/core/site/site-config"
import { mockDatabase } from "@infrastructure/mock/mock-database"
import { cn } from "@presentation/core/design/cn"
import { Button } from "@presentation/core/design/button"
import { Wordmark } from "@presentation/core/brand/wordmark"
import { dashboardStyles } from "./dashboard.styles"

export const Dashboard = () => {
  const router = useRouter()
  const { session, loading, signIn, signOut, isMocked } = useSession()
  const [portfolio, setPortfolio] = useState<Awaited<ReturnType<typeof portfolioQueries.getPublishedPortfolio>>>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!session) return
    void portfolioRepository.findByUser(session.user.id).then(setPortfolio)
  }, [session])

  if (loading) {
    return (
      <div className={dashboardStyles.shell}>
        <p className={dashboardStyles.loading}>Checking your session…</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className={dashboardStyles.root}>
        <div className={dashboardStyles.card}>
          <h1 className={dashboardStyles.title}>Sign in to see your dashboard</h1>
          <p className={dashboardStyles.body}>
            Nothing is published until you publish it. Signing in only claims your URL.
          </p>
          <div className={dashboardStyles.actions}>
            <Button intent="primary" onClick={() => void signIn()}>
              Continue with GitHub
            </Button>
            <Link className={dashboardStyles.link} href="/start">
              Start building
            </Link>
          </div>
          {isMocked ? (
            <p className={dashboardStyles.mockNote}>Mocked session. No network call is made.</p>
          ) : null}
        </div>
      </div>
    )
  }

  const handle = portfolio?.handle ?? session.user.username ?? "yourname"

  const download = () => {
    if (!portfolio) return
    const blob = new Blob([JSON.stringify(portfolio.data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${handle}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const unpublish = async () => {
    if (!portfolio) return
    setBusy(true)
    await portfolioRepository.unpublish(portfolio.handle)
    await portfolioQueries.getPublishedPortfolio(portfolio.handle)
    setPortfolio({ ...portfolio, publishedAt: "" })
    setBusy(false)
  }

  const wipe = () => {
    mockDatabase.reset()
    router.push("/")
  }

  return (
    <div className={dashboardStyles.shell}>
      <div className={dashboardStyles.bar}>
        <div className={dashboardStyles.barInner}>
          <div className={dashboardStyles.barLeft}>
            <Wordmark />
            <Link className={dashboardStyles.account} href="/dashboard">
              {session.user.fullName ?? session.user.username ?? "Dashboard"}
            </Link>
          </div>
          <div className={dashboardStyles.barRight}>
            <Link href="/resume">
              <Button intent="ghost" size="small">
                Resume
              </Button>
            </Link>
            <Link href="/builder">
              <Button intent="ghost" size="small">
                Portfolio
              </Button>
            </Link>
            <Button intent="secondary" onClick={() => void signOut()} size="small">
              Sign out
            </Button>
          </div>
        </div>
      </div>

      <div className={dashboardStyles.root}>
        <div className={dashboardStyles.grid}>
          <div className={dashboardStyles.card}>
            <p className={dashboardStyles.label}>Signed in as</p>
            <p className={dashboardStyles.identity}>{session.user.fullName ?? session.user.email}</p>
            <p className={dashboardStyles.meta}>{session.user.email}</p>
            <p className={dashboardStyles.meta}>via {session.user.provider}</p>
            <div className={dashboardStyles.actions}>
              <Button intent="quiet" onClick={wipe} size="small">
                <LuRefreshCw size={16} strokeWidth={1.5} />
                Reset mock data
              </Button>
            </div>
          </div>

          <div className={dashboardStyles.card}>
            <p className={dashboardStyles.label}>Your portfolio</p>
            {portfolio ? (
              <>
                <p className={dashboardStyles.identity}>{portfolio.data.identity.name}</p>
                <p className={dashboardStyles.meta}>{portfolio.data.identity.headline}</p>
                <p className={dashboardStyles.url}>{portfolioUrl(portfolio.handle)}</p>
                <div className={dashboardStyles.actions}>
                  <Link className={dashboardStyles.link} href={`/p/${portfolio.handle}`}>
                    View live
                    <LuArrowUpRight size={15} strokeWidth={1.5} />
                  </Link>
                  <Link className={dashboardStyles.link} href="/builder">
                    Edit
                  </Link>
                  <Button intent="secondary" onClick={download} size="small">
                    <LuDownload size={16} strokeWidth={1.5} />
                    Export
                  </Button>
                  <Button
                    intent="quiet"
                    disabled={busy}
                    onClick={() => void unpublish()}
                    size="small"
                  >
                    Unpublish
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className={dashboardStyles.identity}>Nothing published yet</p>
                <p className={dashboardStyles.meta}>Claimed handle would be /p/{handle}</p>
                <div className={dashboardStyles.actions}>
                  <Link href="/builder">
                    <Button intent="primary" size="small">
                      Build it
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className={dashboardStyles.card}>
            <p className={dashboardStyles.label}>Your resume</p>
            <p className={dashboardStyles.identity}>Jake&apos;s Resume</p>
            <p className={dashboardStyles.meta}>
              Ten layouts, real LaTeX, and a check that shows you what a parser reads.
            </p>
            <div className={dashboardStyles.actions}>
              <Link className={dashboardStyles.link} href="/resume/templates">
                Choose a layout
                <LuArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
              <Link href="/resume">
                <Button intent="secondary" size="small">
                  Open the editor
                </Button>
              </Link>
            </div>
          </div>

          <div className={cn(dashboardStyles.card, dashboardStyles.cardWide)}>
            <p className={dashboardStyles.label}>Environment</p>
            <p className={dashboardStyles.meta}>
              Mode is{" "}
              <strong className={dashboardStyles.strong}>{isMocked ? "mocked" : "live"}</strong>. Auth,
              database and Razorpay all resolve through {isMocked ? "the mock adapters" : "Supabase"}.
              Toggle it with <code className={dashboardStyles.code}>NEXT_PUBLIC_APP_ENV</code> in{" "}
              <code className={dashboardStyles.code}>.env</code>.
            </p>
            <p className={dashboardStyles.meta}>
              Mock session, portfolio rows, handles, revisions and the entitlement all live in
              localStorage under <code className={dashboardStyles.code}>standout.mock.db</code>.
              Reset above to reseed.
            </p>
            <p className={dashboardStyles.meta}>Origin {siteConfig.origin}</p>
          </div>
        </div>
      </div>
    </div>
  )
}