"use client"

import { createClient } from "@supabase/supabase-js"
import type { PortfolioRepository, SavePortfolioInput } from "@application/portfolio/ports/portfolio-repository"
import type { PublishedPortfolio } from "@application/portfolio/portfolio.schema"
import { hasSupabaseConfig, readSupabaseEnv } from "../../core/supabase/env"

type PortfolioRow = {
  handle: string
  user_id: string
  schema_version: 1
  template_id: string
  config: PublishedPortfolio["config"]
  data: PublishedPortfolio["data"]
  visibility: "public" | "private" | "unlisted"
  published_at: string | null
}

const RESERVED = new Set([
  "api",
  "builder",
  "credits",
  "dashboard",
  "features",
  "new",
  "pricing",
  "privacy",
  "sign-in",
  "signup",
  "standout",
  "templates",
  "terms",
])

const toRecord = (row: PortfolioRow): PublishedPortfolio => ({
  handle: row.handle,
  schemaVersion: row.schema_version,
  templateId: row.template_id,
  config: row.config,
  data: row.data,
  publishedAt: row.published_at ?? new Date().toISOString(),
})

export const createSupabasePortfolioRepository = (): PortfolioRepository | null => {
  const env = readSupabaseEnv()
  if (!hasSupabaseConfig() || !env.url || !env.anonKey) return null

  const client = createClient(env.url, env.anonKey)

  const withAuth = async (userId: string) => {
    const { data } = await client.auth.getSession()
    return client
      .from("portfolios")
      .select("*")
      .eq("user_id", data.session?.user.id ?? userId)
      .limit(1)
  }

  return {
    isMocked: false,

    findByHandle: async (handle) => {
      const { data, error } = await client
        .from("portfolios")
        .select("*")
        .eq("handle", handle.trim().toLowerCase())
        .eq("visibility", "public")
        .maybeSingle()
      if (error || !data) return null
      return toRecord(data as PortfolioRow)
    },

    findByUser: async (userId) => {
      const { data } = await withAuth(userId)
      const row = (data as PortfolioRow[] | null)?.[0]
      return row ? toRecord(row) : null
    },

    isHandleAvailable: async (handle) => {
      const normalised = handle.trim().toLowerCase()
      if (normalised.length < 3) return false
      if (RESERVED.has(normalised)) return false
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalised)) return false
      const { data } = await client.from("handles").select("handle").eq("handle", normalised).maybeSingle()
      return data === null
    },

    save: async (input) => {
      const now = new Date().toISOString()
      const { data: sessionData } = await client.auth.getSession()
      const authUserId = sessionData.session?.user.id ?? input.userId

      await client.from("handles").upsert({
        handle: input.handle,
        user_id: authUserId,
        status: "active",
      })

      const { data, error } = await client
        .from("portfolios")
        .upsert(
          {
            handle: input.handle,
            user_id: authUserId,
            schema_version: 1,
            template_id: input.templateId,
            config: input.config,
            data: input.data,
            visibility: input.visibility,
            published_at: now,
            updated_at: now,
          },
          { onConflict: "handle" },
        )
        .select("*")
        .single()

      if (error || !data) throw new Error(error?.message ?? "Could not publish")

      await client.from("portfolio_revisions").insert({
        handle: input.handle,
        schema_version: 1,
        data: input.data,
      })

      return toRecord(data as PortfolioRow)
    },

    unpublish: async (handle) => {
      await client
        .from("portfolios")
        .update({ visibility: "private", published_at: null })
        .eq("handle", handle)
    },

    remove: async (handle) => {
      await client.from("portfolio_revisions").delete().eq("handle", handle)
      await client.from("portfolios").delete().eq("handle", handle)
      await client.from("handles").delete().eq("handle", handle)
    },
  }
}