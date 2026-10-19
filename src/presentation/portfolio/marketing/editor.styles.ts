export const editorStyles = {
  root: "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8",
  split: "contents",

  editorShell: "flex h-[520px] min-h-0 flex-col overflow-hidden rounded-panel bg-ground-sunken md:h-[640px]",
  editorFill: "min-h-0 flex-1",

  stage: "bg-ground-sunken flex h-[520px] min-h-0 flex-col overflow-hidden rounded-panel md:h-[640px]",
  stageFill: "min-h-0 flex-1 overflow-y-auto rounded-panel",

  paneHead: "flex items-center justify-between gap-3 px-5 py-3.5",
  paneLabel: "text-micro text-ink-45 font-medium",
  paneNote: "text-micro text-ink-45",

  statusOk: "text-micro text-ink flex items-center gap-1.5 font-medium",
  statusBad: "text-micro text-ink font-medium",

  issueList: "mt-3 flex flex-col gap-2",
  issue: "bg-ground-sunken text-micro text-ink rounded-panel px-4 py-3",
  issueField: "text-blue font-medium",
} as const

export const heroStyles = {
  page: "relative isolate",
  pageBody: "relative z-10",
  root: "mx-auto flex w-full max-w-[1440px] flex-col gap-14 overflow-clip px-5 pb-24 pt-16 md:px-8 md:pt-24",
  copy: "flex flex-col items-start",
  title: "text-display text-ink mt-8 max-w-[13ch]",
  lead: "text-lead text-ink-70 mt-8 max-w-[46ch]",
  actionRow: "mt-10 flex flex-wrap items-center gap-6",
  secondaryLink: "text-small text-ink-70 underline underline-offset-4 hover:text-ink",
} as const
export const galleryStyles = {
  root: "grid grid-cols-1 gap-12 lg:grid-cols-12",
  head: "lg:col-span-4",
  heading: "text-title text-ink",
  body: "text-body text-ink-70 mt-6 max-w-[40ch]",
  grid: "grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8",
  plate: "flex flex-col gap-3",
  frame: "relative aspect-[4/5] overflow-hidden rounded-panel bg-ground-sunken",
  image: "object-cover",
  caption: "text-small text-ink-70",
  creditButton: "absolute right-3 bottom-3 bg-ink text-white/80 rounded-pill px-3 py-1.5 text-micro",
  creditLink: "text-micro text-ink-45 inline-flex items-center gap-1 underline underline-offset-4 hover:text-ink",
} as const