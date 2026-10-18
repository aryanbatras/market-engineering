export const navStyles = {
  bar: "bg-ground/85 sticky top-0 z-50 backdrop-blur-md",
  inner: "mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 md:px-8",
  wordmark: "text-body text-ink font-medium tracking-tight",
  links: "hidden items-center gap-8 md:flex",
  mobileRow: "bg-ground-sunken flex items-center gap-6 px-5 py-3 md:hidden",
  mobileLink: "text-small text-ink-70",
  link: "text-small text-ink-70 transition-colors duration-micro hover:text-ink",
  actions: "flex items-center gap-3",
} as const

export const footerStyles = {
  root: "bg-ground-sunken mt-24",
  top: "mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-10 px-5 py-16 md:grid-cols-4 md:px-8",
  wordmarkBig: "text-display text-ink col-span-full md:col-span-4",
  column: "flex flex-col gap-3",
  columnTitle: "text-micro text-ink-45 font-medium",
  link: "text-small text-ink-70 hover:text-ink transition-colors duration-micro",
  legal: "text-micro text-ink-45 px-5 py-6 md:px-8",
} as const