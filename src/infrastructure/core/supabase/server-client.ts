import { createClient } from "@supabase/supabase-js"
import { hasSupabaseConfig, readSupabaseEnv } from "./env"

export const createSupabaseAdminClient = () => {
  const env = readSupabaseEnv()
  if (!hasSupabaseConfig() || !env.url || !env.serviceRoleKey) return null
  return createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
