export const mediaStyles = {
  band: "bg-ink relative min-h-[100dvh] overflow-hidden",
  plate: "absolute inset-0 size-full object-cover opacity-70",
  scrim: "absolute inset-0 bg-ink/70",
  caption: "absolute right-5 bottom-4 text-micro text-white/50",

  inner: "relative mx-auto flex h-full w-full max-w-[1440px] flex-col justify-center px-5 py-24 md:px-8",

  heading: "text-display text-white max-w-[14ch]",
  grid: "mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8",
  cell: "flex flex-col gap-3",
  cellLabel: "text-micro text-blue font-medium",
  cellBody: "text-lead text-white/85 max-w-[26ch]",
  creditRow: "mt-16 flex items-center justify-between gap-6",
  creditText: "text-micro text-white/45",
  creditLink: "text-micro text-white/70 underline underline-offset-4",
} as const