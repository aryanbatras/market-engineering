import { createBrowserClient } from "@supabase/ssr"
import type { AuthGateway, AuthProvider, AuthSession, AuthUser } from "@application/ports/auth-gateway"
import { hasSupabaseConfig, readSupabaseEnv } from "../supabase/env"

type SupabaseUser = {
  id: string
  email?: string | null
  created_at: string
  app_metadata?: { provider?: string } | null
  user_metadata?: {
    full_name?: string | null
    name?: string | null
    preferred_username?: string | null
    avatar_url?: string | null
  } | null
}

const toAuthUser = (raw: SupabaseUser): AuthUser => ({
  id: raw.id,
  email: raw.email ?? null,
  fullName: raw.user_metadata?.full_name ?? raw.user_metadata?.name ?? null,
  username: raw.user_metadata?.preferred_username ?? null,
  avatarUrl: raw.user_metadata?.avatar_url ?? null,
  provider: (raw.app_metadata?.provider as AuthProvider | undefined) ?? null,
  createdAt: raw.created_at,
})

const toSession = (accessToken: string, expiresIn: number, user: SupabaseUser): AuthSession => ({
  accessToken,
  expiresAt: Date.now() + expiresIn * 1000,
  user: toAuthUser(user),
})

export const createSupabaseAuthGateway = (): AuthGateway | null => {
  const env = readSupabaseEnv()
  if (!hasSupabaseConfig() || !env.url || !env.anonKey) return null

  const client = createBrowserClient(env.url, env.anonKey)

  return {
    isMocked: false,

    getSession: async () => {
      const { data, error } = await client.auth.getSession()
      const session = data?.session
      if (error || !session) return null
      const raw = session.user as unknown as SupabaseUser | null
      if (!raw) return null
      return toSession(session.access_token, session.expires_in ?? 3600, raw)
    },

    getUser: async () => {
      const { data } = await client.auth.getSession()
      const raw = data?.session?.user as unknown as SupabaseUser | null
      return raw ? toAuthUser(raw) : null
    },

    signInWithProvider: async (provider) => {
      const { data, error } = await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/dashboard` },
      })
      if (error || !data) throw new Error(error?.message ?? "Sign in was cancelled")
      if (typeof window !== "undefined") window.location.href = data.url
      return toSession("", 0, {
        id: "",
        created_at: new Date().toISOString(),
      })
    },

    signOut: async () => {
      await client.auth.signOut()
    },
  }
}