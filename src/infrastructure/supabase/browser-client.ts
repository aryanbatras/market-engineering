"use client"

import { createBrowserClient } from "@supabase/ssr"
import { readSupabaseEnv } from "./env"
import { hasSupabaseConfig } from "./env"

export const createSupabaseBrowserClient = () => {
  const env = readSupabaseEnv()
  if (!hasSupabaseConfig() || !env.url || !env.anonKey) return null
  return createBrowserClient(env.url, env.anonKey)
}
