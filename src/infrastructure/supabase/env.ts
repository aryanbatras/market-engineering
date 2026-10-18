export type SupabaseEnv = {
  url: string | null
  anonKey: string | null
  serviceRoleKey: string | null
}

export const readSupabaseEnv = (): SupabaseEnv => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? null,
})

export const hasSupabaseConfig = (): boolean => {
  const env = readSupabaseEnv()
  return env.url !== null && env.anonKey !== null
}
