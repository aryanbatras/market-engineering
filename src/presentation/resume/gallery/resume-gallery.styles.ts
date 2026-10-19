export const galleryStyles = {
  shell: "bg-ground min-h-dvh",
  bar: "bg-ground sticky top-0 z-40 border-b border-ink-15",
  barInner:
    "mx-auto flex h-[64px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 md:px-8",
  crumb: "text-micro text-ink-45",

  page: "mx-auto w-full max-w-[1440px] px-5 py-14 md:px-8 md:py-20",
  head: "max-w-[56ch]",
  title: "text-display text-ink max-w-[14ch]",
  lead: "text-body text-ink-70 mt-6",

  grid: "mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",

  item: "bg-ground-sunken rounded-panel p-5 transition-colors duration-micro ease-out hover:bg-blue-wash",
  foot: "mt-5 flex items-baseline justify-between gap-4",
  name: "text-body text-ink font-medium",
  meta: "text-micro text-ink-70 mt-2 block max-w-[44ch]",

  frame: "relative mt-6 h-[420px] overflow-hidden rounded-panel",
  canvas: "w-[794px] origin-top-left [zoom:0.41]",
} as const