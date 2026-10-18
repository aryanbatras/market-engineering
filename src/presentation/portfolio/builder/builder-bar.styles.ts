export const builderBarStyles = {
  bar: "bg-ground sticky top-0 z-40 border-b border-ink-15",
  inner: "mx-auto flex h-[64px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 md:px-8",
  left: "flex min-w-0 items-center gap-3",
  crumb: "text-micro text-ink-45 truncate",

  actions: "flex shrink-0 items-center gap-1",

  account: "text-small text-ink hover:text-blue hidden md:inline",
  toast: "bg-ink text-white fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill px-5 py-3 text-small",
} as const