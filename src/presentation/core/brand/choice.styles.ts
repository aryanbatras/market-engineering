export const choiceStyles = {
  shell: "bg-ground-sunken min-h-dvh",
  bar: "bg-ground relative z-40",
  barInner: "mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 md:px-8",
  crumb: "text-micro text-ink-45",

  stage: "mx-auto w-full max-w-[1440px] px-5 py-20 md:px-8 md:py-28",
  title: "text-display max-w-[16ch] text-ink",
  lead: "text-lead mt-8 max-w-[46ch] text-ink-70",
  grid: "mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2",
  card: "bg-ground flex flex-col gap-4 rounded-panel p-8",
  icon: "text-ink-45",
  cardTitle: "text-title text-ink",
  cardBody: "text-body max-w-[44ch] text-ink-70",
  cta: "text-small text-blue mt-4 inline-flex items-center gap-2 font-medium",
} as const