export const galleryStyles = {
  shell: "bg-ground-sunken min-h-dvh",
  bar: "bg-ground relative z-40",
  barInner: "mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-4 px-5 md:px-8",
  crumb: "text-micro text-ink-45",

  head: "mx-auto w-full max-w-[1440px] px-5 pt-20 pb-12 md:px-8 md:pt-28",
  title: "text-display text-ink",
  lead: "text-body mt-6 max-w-[54ch] text-ink-70",

  split: "mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-5 pb-24 md:px-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-14",

  list: "flex flex-col gap-2",
  listLabel: "text-micro mb-2 text-ink-45",
  item: "bg-ground rounded-panel px-4 py-3 text-left",
  itemActive: "bg-blue-wash rounded-panel px-4 py-3 text-left",
  itemName: "text-small text-ink font-medium",
  itemMeta: "text-micro mt-0.5 block text-ink-70",

  stage: "flex flex-col",
  stageName: "text-title text-ink",
  stageSummary: "text-body mt-3 max-w-[52ch] text-ink-70",
  stageFor: "text-small mt-2 max-w-[52ch] text-ink-45",
  stageActions: "mt-8",
  sheetWrap: "mt-8",
} as const