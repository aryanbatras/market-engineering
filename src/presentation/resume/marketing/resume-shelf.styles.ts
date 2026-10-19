export const resumeShelfStyles = {
  root: "mx-auto w-full max-w-[1440px] px-5 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28",
  head: "flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16",
  copy: "flex flex-col gap-5",
  title: "text-title text-ink",
  lead: "text-body max-w-[44ch] text-ink-70",

  grid: "mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",

  item: "bg-ground-sunken rounded-panel p-5 transition-colors duration-micro ease-out hover:bg-blue-wash",
  frame: "relative mt-5 h-[400px] overflow-hidden rounded-panel",
  canvas: "w-[794px] origin-top-left [zoom:0.39]",

  foot: "mt-5 flex items-baseline justify-between gap-4",
  name: "text-small text-ink font-medium",
  note: "text-micro text-ink-70",

  all: "text-small text-ink-70 inline-flex shrink-0 items-center gap-1.5 underline underline-offset-4 hover:text-ink",
} as const