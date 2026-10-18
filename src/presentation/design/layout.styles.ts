export const layoutClasses = {
  page: "bg-ground text-ink min-h-dvh",
  shell: "mx-auto w-full max-w-[1440px] px-5 md:px-8",
  flow: "flex flex-col",
  section: "py-24 md:py-40",
  sectionTight: "py-16 md:py-24",
  sectionFlush: "py-0",
} as const

export const proseClasses = {
  lead: "text-lead text-ink",
  body: "text-body text-ink",
  secondary: "text-body text-ink-70",
  muted: "text-small text-ink-70",
  faint: "text-micro text-ink-45",
  display: "text-display",
  title: "text-title",
  narrow: "max-w-[68ch]",
  narrowIntro: "max-w-[62ch] md:ml-[15%]",
} as const

export const measureClasses = {
  prose: "max-w-[68ch]",
  intro: "max-w-[34rem] md:ml-[15%]",
  centre: "mx-auto",
} as const
