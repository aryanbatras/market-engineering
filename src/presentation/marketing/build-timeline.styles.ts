export const timelineStyles = {
  root: "mt-6 flex flex-col gap-6",
  rail: "grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-10",
  node: "flex flex-col gap-2 md:border-l md:border-ground-sunken md:pl-6",

  markerRow: "flex items-center gap-3",
  marker: "size-2.5 rounded-pill bg-blue",

  step: "text-micro text-blue font-medium",
  title: "text-small text-ink font-medium mt-1",
  body: "text-body text-ink-70 mt-3 max-w-[36ch]",
  time: "text-micro text-ink-45 tabular-nums",

  readouts: "grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4",
  readout: "flex flex-col gap-1",
  readoutLabel: "text-micro text-ink-45",
  readoutValue: "text-lead text-ink tabular-nums",
  bar: "h-1 rounded-pill bg-ground-sunken overflow-hidden",
  barFill: "h-full bg-blue",
} as const