export const resumeBandStyles = {
  root: "bg-ground-sunken py-20 md:py-28",
  inner: "mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16",

  copy: "flex flex-col justify-center gap-5",
  title: "text-title text-ink",
  lead: "text-body max-w-[42ch] text-ink-70",

  pane: "bg-ground mt-6 rounded-panel p-6",
  paneLabel: "font-mono text-micro text-ink-45",
  paneText: "mt-2 font-mono text-micro leading-[1.7] whitespace-pre-wrap text-ink",
  verdict: "mt-4 text-small text-ink font-medium",

  sheetWrap: "mt-2",
  sheetScale: "origin-top-left",

  sheet: "bg-ground shadow-float w-[794px] min-h-[1123px] px-[72px] py-[68px]",
  frame: "bg-ground-sunken overflow-x-auto rounded-panel p-6 md:p-8",

  name: "text-[34px] leading-[1.15] font-bold tracking-[-0.03em] text-ink",
  note: "mt-2 text-[15px] leading-[1.4] text-ink-70 italic",
  contact: "mt-3 text-[13px] leading-[1.7] text-ink",
  heading: "mt-7 mb-2 border-b border-ink-15 pb-1.5 text-[15px] font-bold text-ink",
  entry: "mt-4",
  entryLine: "flex items-baseline justify-between gap-4",
  entryTitle: "text-[14px] font-bold text-ink",
  entryDates: "shrink-0 text-[12px] text-ink-70",
  entryMeta: "mt-0.5 text-[12px] text-ink-70",
  entrySummary: "mt-1 text-[12.5px] leading-[1.45] text-ink",
  bullets: "mt-1 flex list-none flex-col gap-0.5 pl-0",
  bullet: "text-[12.5px] leading-[1.45] text-ink",
  bulletMark: "mr-1.5 inline-block w-2 text-ink-70",
  skills: "mt-1.5 flex flex-col gap-1",
  skillLine: "text-[12.5px] leading-[1.45] text-ink",
  skillLabel: "font-bold text-ink",
} as const