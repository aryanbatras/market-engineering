export const resumeShelfStyles = {
  root: "mx-auto w-full max-w-[1440px] px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28",
  head: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16",
  copy: "flex flex-col gap-5",
  title: "text-title text-ink",
  lead: "text-body max-w-[44ch] text-ink-70",

  rail: "mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4",
  item: "flex w-[326px] shrink-0 snap-start flex-col gap-4",

  frame: "relative h-[430px] overflow-hidden rounded-panel bg-ground-sunken",
  canvas: "w-[794px] origin-top-left [zoom:0.41]",

  foot: "flex items-baseline justify-between gap-4",
  name: "text-small text-ink font-medium",
  note: "text-micro text-ink-45",

  all: "text-small text-ink-70 inline-flex shrink-0 items-center gap-1.5 underline underline-offset-4 hover:text-ink",
} as const