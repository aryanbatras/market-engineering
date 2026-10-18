export type AppEnvironment = "development" | "production"

const readEnvironment = (): AppEnvironment => {
  const raw = process.env.NEXT_PUBLIC_APP_ENV?.trim()
  return raw === "production" ? "production" : "development"
}

export const appEnvironment: AppEnvironment = readEnvironment()

export const isMockEnvironment = (): boolean => appEnvironment === "development"

export const modeLabel = isMockEnvironment() ? "mocked" : "live"