import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { hasSupabaseConfig, readSupabaseEnv } from "../supabase/env"

export const createDatabase = () => {
  const env = readSupabaseEnv()
  const url = process.env.DATABASE_URL ?? env.url
  if (!hasSupabaseConfig() || !url) return null
  const client = postgres(url, { max: 1, prepare: false })
  return drizzle(client, { schema: {} })
}

export type Database = NonNullable<ReturnType<typeof createDatabase>>