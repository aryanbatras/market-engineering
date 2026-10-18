export type MockTable = "users" | "handles" | "portfolios" | "portfolio_revisions" | "entitlements"

type MockRow = Record<string, unknown>

type MockDatabaseShape = {
  users: MockRow[]
  handles: MockRow[]
  portfolios: MockRow[]
  portfolio_revisions: MockRow[]
  entitlements: MockRow[]
}

const STORAGE_KEY = "standout.mock.db"
const SESSION_KEY = "standout.mock.session"

const empty = (): MockDatabaseShape => ({
  users: [],
  handles: [],
  portfolios: [],
  portfolio_revisions: [],
  entitlements: [],
})

const canUseDom = () => typeof window !== "undefined"

const readRaw = (): MockDatabaseShape => {
  if (!canUseDom()) return empty()
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === null) return empty()
  try {
    return { ...empty(), ...(JSON.parse(stored) as Partial<MockDatabaseShape>) }
  } catch {
    return empty()
  }
}

const writeRaw = (data: MockDatabaseShape): void => {
  if (!canUseDom()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const mockDatabase = {
  select: (table: MockTable): MockRow[] => readRaw()[table],

  insert: (table: MockTable, row: MockRow): MockRow => {
    const data = readRaw()
    data[table] = [...data[table], row]
    writeRaw(data)
    return row
  },

  update: (table: MockTable, match: Partial<MockRow>, patch: Partial<MockRow>): MockRow[] => {
    const data = readRaw()
    data[table] = data[table].map((row) => {
      const matches = Object.entries(match).every(([key, value]) => row[key] === value)
      return matches ? { ...row, ...patch } : row
    })
    writeRaw(data)
    return data[table]
  },

  remove: (table: MockTable, match: Partial<MockRow>): number => {
    const data = readRaw()
    const before = data[table].length
    data[table] = data[table].filter(
      (row) => !Object.entries(match).every(([key, value]) => row[key] === value),
    )
    writeRaw(data)
    return before - data[table].length
  },

  reset: (): void => {
    if (!canUseDom()) return
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(SESSION_KEY)
  },

  readSession: <T,>(): T | null => {
    if (!canUseDom()) return null
    const stored = window.localStorage.getItem(SESSION_KEY)
    if (stored === null) return null
    try {
      return JSON.parse(stored) as T
    } catch {
      return null
    }
  },

  writeSession: (value: unknown): void => {
    if (!canUseDom()) return
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(value))
  },

  clearSession: (): void => {
    if (!canUseDom()) return
    window.localStorage.removeItem(SESSION_KEY)
  },
}

export type MockDatabase = typeof mockDatabase