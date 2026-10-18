export const sheetStyles = {
  frame: "bg-ground-sunken overflow-x-auto rounded-panel p-6 md:p-10",
  stage: "mx-auto w-[794px] origin-top-left",
  page: "bg-ground shadow-float w-[794px] min-h-[1123px] px-[72px] py-[68px]",
  scale: "w-[794px] origin-top-left",

  name: "text-[34px] leading-[1.15] font-bold tracking-[-0.03em] text-ink",
  note: "mt-2 text-[15px] leading-[1.4] text-ink-70 italic",
  contact: "mt-3 max-w-[64ch] text-[13px] leading-[1.7] text-ink",

  headingPlain: "mt-7 mb-2 text-[15px] font-bold text-ink",
  headingRule: "mt-7 mb-2 border-b border-ink-15 pb-1.5 text-[15px] font-bold text-ink",

  entry: "mt-4",
  entryLine: "flex items-baseline justify-between gap-4",
  entryTitle: "text-[14px] font-bold text-ink",
  entryDates: "shrink-0 text-[13px] text-ink-70",
  entryMeta: "mt-0.5 text-[13px] text-ink-70",
  entrySummary: "mt-1 text-[14px] leading-[1.45] text-ink",
  bullets: "mt-1 flex list-none flex-col gap-0.5 pl-0",
  bullet: "text-[14px] leading-[1.45] text-ink",
  bulletMark: "mr-1.5 inline-block w-2 text-ink-70",

  skills: "mt-1.5 flex flex-col gap-1",
  skillLine: "text-[14px] leading-[1.45] text-ink",
  skillLabel: "font-bold text-ink",

  columns: "mt-6 flex gap-8",
  rail: "w-[28%] shrink-0",
  main: "min-w-0 flex-1",

  accentName: "inline-block px-3 py-1.5 text-[30px] leading-[1.1] font-bold text-white",
  accentHeading: "mb-2 inline-block px-2 py-1 text-[13px] font-bold text-white",
} as const