"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LuGithub, LuMail } from "react-icons/lu"
import { useSession } from "@application/auth/use-session"
import { siteConfig } from "@application/site/site-config"
import { Button } from "@presentation/design/button"
import { Wordmark } from "@presentation/marketing/wordmark"
import { signInStyles } from "./sign-in.styles"

export const SignInView = () => {
  const router = useRouter()
  const { session, signIn, signOut, isMocked, loading } = useSession()
  const [busy, setBusy] = useState(false)

  const handleSignIn = async () => {
    setBusy(true)
    try {
      await signIn()
      router.push("/dashboard")
    } finally {
      setBusy(false)
    }
  }

  if (session) {
    return (
      <div className={signInStyles.root}>
        <div className={signInStyles.inner}>
          <Wordmark />
          <h1 className={signInStyles.title}>You are signed in</h1>
          <p className={signInStyles.body}>
            {session.user.fullName ?? session.user.email} via {session.user.provider}
          </p>
          <div className={signInStyles.row}>
            <Button block intent="primary" onClick={() => router.push("/dashboard")}>
              Go to dashboard
            </Button>
            <Button block intent="ghost" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
          {isMocked ? <p className={signInStyles.note}>Mocked session, no network call made.</p> : null}
        </div>
      </div>
    )
  }

  return (
    <div className={signInStyles.root}>
      <div className={signInStyles.inner}>
        <Wordmark />
        <h1 className={signInStyles.title}>Sign in</h1>
        <p className={signInStyles.body}>
          Use the account you already have. Nothing is published until you publish it.
        </p>

        <div className={signInStyles.row}>
          <Button block disabled={busy || loading} intent="primary" onClick={() => void handleSignIn()}>
            <LuGithub aria-hidden size={17} strokeWidth={1.5} />
            {isMocked ? "Continue as Naina Kumari (mocked)" : "Continue with GitHub"}
          </Button>
          <Button block disabled={busy} intent="secondary" onClick={() => void handleSignIn()}>
            <LuMail aria-hidden size={17} strokeWidth={1.5} />
            Continue with Google
          </Button>
        </div>

        <p className={signInStyles.note}>
          {isMocked
            ? "Mock mode. No request leaves this browser — the session is written to localStorage."
            : "GitHub or Google. We never ask you to create a new password."}
        </p>

        <Link className={signInStyles.foot} href="/">
          Back to {siteConfig.name}
        </Link>
      </div>
    </div>
  )
}