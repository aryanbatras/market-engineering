export type AuthProvider = "github" | "google"

export type AuthUser = {
  id: string
  email: string | null
  fullName: string | null
  username: string | null
  avatarUrl: string | null
  provider: AuthProvider | null
  createdAt: string
}

export type AuthSession = {
  accessToken: string
  expiresAt: number
  user: AuthUser
}

export type AuthGateway = {
  getSession: () => Promise<AuthSession | null>
  getUser: () => Promise<AuthUser | null>
  signInWithProvider: (provider: AuthProvider) => Promise<AuthSession>
  signOut: () => Promise<void>
  isMocked: boolean
}