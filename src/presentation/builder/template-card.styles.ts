export const templateCardStyles = {
  heading: "text-title text-ink",
  grid: "mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",

  card: "bg-ground-sunken rounded-panel p-5",
  cardActive: "bg-blue-wash",

  head: "flex items-center justify-between gap-4",
  name: "text-body text-ink font-medium",
  forWhom: "text-small text-ink-70 mt-3 max-w-[46ch]",

  frame: "bg-ground-sunken mt-6 h-[440px] overflow-hidden rounded-panel",
  frameFill: "h-[calc(100dvh-280px)]",
  stage: "stage-canvas size-full overflow-x-hidden overflow-y-auto",
  canvas: "page-canvas bg-white",
  canvasDark: "bg-ink",
  loading: "size-full",

  tag: "bg-ground text-ink-70 rounded-pill px-2.5 py-1 text-micro",
  tagPro: "bg-blue text-white rounded-pill px-2.5 py-1 text-micro",

  viewMore:
    "bg-ink text-white flex min-h-[320px] items-center justify-center gap-3 rounded-panel text-lead hover:bg-blue-deep md:col-span-2 xl:col-span-3",
  viewMoreText: "text-lead",
} as const