export const sheetStyles = {
  frame: "bg-ground-sunken overflow-x-auto rounded-panel p-6 md:p-10",
  stage: "mx-auto w-[794px] origin-top-left",
  page: "bg-ground shadow-float w-[794px] min-h-[1123px] leading-[1.24]",

  centred: "text-center",
  name: "leading-[1.12] font-bold tracking-[-0.03em] text-ink",
  nameCentred: "leading-[1.12] font-bold tracking-[-0.03em] text-ink text-center",
  nameBoxed: "inline-block px-4 py-2.5 leading-[1.1] font-bold text-white",

  headerRule: "bg-ink-15 mt-4 block h-px w-full",

  note: "mt-2 leading-[1.4] text-ink-70 italic",
  noteBold: "text-ink font-medium not-italic",
  contact: "mt-3 max-w-[64ch] leading-[1.7] text-ink",

  headingPlain: "mb-2 font-bold text-ink",
  headingRule: "mb-2 border-b border-ink-15 pb-1.5 font-bold text-ink",
  headingBar: "mb-3 inline-block px-2.5 py-1 text-[12px] font-bold text-white",
  headingCaret: "mb-2 flex items-center gap-2 font-bold text-ink",
  headingCaps: "font-bold uppercase tracking-[0.06em]",
  caret: "bg-ink inline-block size-[7px] shrink-0 rounded-[1px]",

  entry: "",
  entryLine: "flex items-baseline justify-between gap-4",
  entryInline: "leading-[1.4]",
  entryDivider: "text-ink-45",
  entryTitle: "font-bold text-ink",
  entryDates: "shrink-0 text-ink-70",
  entryMeta: "mt-0.5 text-ink-70",
  entrySummary: "mt-1 leading-[1.45] text-ink",
  bullets: "mt-1 flex list-none flex-col gap-0.5 pl-0",
  bulletsPlain: "pl-0",
  bullet: "leading-[1.45] text-ink",
  bulletMark: "mr-1.5 inline-block w-2 text-ink-70",

  skills: "mt-1.5 flex flex-col gap-1",
  skillLine: "leading-[1.45] text-ink",
  skillLabel: "font-bold text-ink",

  columns: "flex items-start gap-8",
  rail: "shrink-0",
  railTinted: "bg-blue-wash rounded-panel p-4",
  main: "min-w-0 flex-1",
} as const