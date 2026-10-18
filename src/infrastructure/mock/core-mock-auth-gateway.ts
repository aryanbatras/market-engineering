import mockUser from "./fixtures/user.json"
import { mockDatabase } from "./mock-database"
import { seedMockDatabase, mockUserId } from "./portfolio/seed"
import type { AuthGateway, AuthProvider, AuthSession, AuthUser } from "@application/core/ports/auth-gateway"

const SESSION_TTL_MS = 60 * 60 * 1000

const toAuthUser = (raw: typeof mockUser, provider: AuthProvider): AuthUser => ({
  id: raw.id,
  email: raw.email,
  fullName: raw.user_metadata.full_name ?? null,
  username: raw.user_metadata.preferred_username ?? null,
  avatarUrl: raw.user_metadata.avatar_url ?? null,
  provider,
  createdAt: raw.created_at,
})

const buildSession = (provider: AuthProvider): AuthSession => {
  const now = Date.now()
  return {
    accessToken: `mock-jwt.${rawToken(provider)}.${now}`,
    expiresAt: now + SESSION_TTL_MS,
    user: toAuthUser(mockUser, provider),
  }
}

const rawToken = (provider: AuthProvider): string =>
  btoa(`${mockUserId}:${provider}:${mockUser.created_at}`).replace(/=+$/, "")

export const mockAuthGateway: AuthGateway = {
  isMocked: true,

  getSession: async () => {
    seedMockDatabase()
    const session = mockDatabase.readSession<AuthSession>()
    if (!session) return null
    if (session.expiresAt < Date.now()) {
      mockDatabase.clearSession()
      return null
    }
    return session
  },

  getUser: async () => {
    const session = await mockAuthGateway.getSession()
    return session?.user ?? null
  },

  signInWithProvider: async (provider) => {
    seedMockDatabase()
    const session = buildSession(provider)
    mockDatabase.writeSession(session)
    mockDatabase.update("users", { id: mockUserId }, {
      app_metadata: { provider, providers: [provider] },
      last_sign_in_at: new Date().toISOString(),
    })
    return session
  },

  signOut: async () => {
    mockDatabase.clearSession()
  },
}