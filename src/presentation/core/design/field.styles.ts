export const fieldClasses = {
  stack: "flex flex-col gap-2",
  label: "text-small text-ink font-medium",
  help: "text-micro text-ink-45",
  error: "text-micro text-ink flex items-start gap-2",
  errorMark: "bg-blue mt-1.5 size-1.5 shrink-0 rounded-full",
  control:
    "bg-ground-sunken border-ink-15 w-full rounded-pill border px-5 text-body text-ink placeholder:text-ink-45 focus:border-blue focus:outline-none",
  controlTall: "min-h-12 py-3 leading-relaxed",
  controlHeight: "h-12",
  controlPlain:
    "bg-ground w-full rounded-panel border border-ink-15 px-5 py-3 font-mono text-small text-ink focus:border-blue focus:outline-none",
} as const
