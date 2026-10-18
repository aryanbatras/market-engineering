"use client"

import Link from "next/link"
import { useSession } from "@application/core/auth/use-session"
import { Button } from "@presentation/core/design/button"
import { navStyles } from "./nav.styles"

export const SessionActions = () => {
  const { session, loading, signIn } = useSession()

  if (session) {
    return (
      <div className={navStyles.actions}>
        <Link className={navStyles.account} href="/dashboard">
          {session.user.fullName ?? session.user.username}
        </Link>
        <Link href="/builder">
          <Button intent="primary" size="small">
            Start building
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className={navStyles.actions}>
      <Link className={navStyles.link} href="/sign-in">
        Sign in
      </Link>
      <Link href="/builder">
        <Button disabled={loading} intent="primary" onClick={() => void signIn()} size="small">
          Start building
        </Button>
      </Link>
    </div>
  )
}