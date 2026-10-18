export const railStyles = {
  root: "mx-auto w-full max-w-[1440px] px-5 md:px-8",
  head: "text-title text-ink max-w-[18ch]",
  note: "text-body text-ink-70 mt-6 max-w-[46ch]",

  track: "relative mt-12 md:mt-16",

  step: "relative grid grid-cols-1 gap-4 pb-16 last:pb-0 md:grid-cols-[40px_minmax(0,1fr)] md:gap-10 md:pb-24",

  marker: "z-10 flex size-6 shrink-0 items-center justify-center rounded-pill bg-ground md:size-10",
  markerRing: "border-blue size-6 rounded-pill border-2 md:size-10",
  markerCore: "bg-blue size-2.5 rounded-pill",

  when: "text-micro text-ink-45 tabular-nums",
  title: "text-display text-ink max-w-[16ch]",
  body: "text-lead text-ink-70 mt-6 max-w-[44ch]",
  detail: "mt-8 flex flex-wrap gap-x-8 gap-y-3",
  detailItem: "flex flex-col gap-1",
  detailLabel: "text-micro text-ink-45",
  detailValue: "text-small text-ink",

  end: "md:grid-cols-[40px_minmax(0,1fr)] mt-2 flex items-start gap-4 md:gap-10",
  endLabel: "text-micro text-ink-45",
  endValue: "text-lead text-ink",
} as const