"use client"

import { useCallback, useEffect, useState } from "react"
import type { AuthGateway, AuthSession } from "@application/ports/auth-gateway"
import { isMockEnvironment } from "@application/site/app-environment"
import { mockAuthGateway } from "@infrastructure/auth/mock-auth-gateway"
import { createSupabaseAuthGateway } from "@infrastructure/auth/supabase-auth-gateway"

const resolveAuthGateway = (): AuthGateway => {
  if (isMockEnvironment()) return mockAuthGateway
  return createSupabaseAuthGateway() ?? mockAuthGateway
}

export const authGateway = resolveAuthGateway()

type SessionState = {
  session: AuthSession | null
  ready: boolean
}

export type UseSession = {
  session: AuthSession | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  isMocked: boolean
}

export const useSession = (): UseSession => {
  const [state, setState] = useState<SessionState>({ session: null, ready: false })

  useEffect(() => {
    let active = true
    authGateway
      .getSession()
      .then((session) => {
        if (active) setState({ session, ready: true })
      })
      .catch(() => {
        if (active) setState({ session: null, ready: true })
      })
    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async () => {
    const session = await authGateway.signInWithProvider("github")
    setState({ session, ready: true })
  }, [])

  const signOut = useCallback(async () => {
    await authGateway.signOut()
    setState({ session: null, ready: true })
  }, [])

  return {
    session: state.session,
    loading: !state.ready,
    signIn,
    signOut,
    isMocked: authGateway.isMocked,
  }
}