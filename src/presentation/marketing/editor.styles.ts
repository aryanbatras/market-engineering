export const editorStyles = {
  root: "bg-ground-sunken rounded-panel p-4 md:p-6",
  split: "grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
  left: "flex min-h-0 min-w-0 flex-col",
  right: "flex min-h-0 min-w-0 flex-col",
  bar: "flex items-center justify-between gap-3 pb-3",
  barSpacer: "text-micro text-ink-45 font-medium",
  editorShell: "flex h-[420px] min-h-0 flex-col md:h-[560px]",
  statusRow: "mt-3 flex items-center justify-between gap-3",
  statusOk: "text-micro text-blue flex items-center gap-2 font-medium",
  statusPending: "text-micro text-ink-45 flex items-center gap-2 font-medium",
  statusBad: "text-micro text-ink flex items-center gap-2 font-medium",
  issueList: "mt-3 flex flex-col gap-2",
  issue: "bg-ground-sunken text-micro text-ink rounded-panel px-4 py-3",
  issueField: "text-blue font-medium",
} as const

export const heroStyles = {
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
