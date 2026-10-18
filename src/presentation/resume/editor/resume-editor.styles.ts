export const editorStyles = {
  shell: "bg-ground min-h-dvh",
  bar: "bg-ground sticky top-0 z-40 border-b border-ink-15",
  barInner:
    "mx-auto flex min-h-[64px] w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-3 md:px-8",
  barLeft: "flex flex-wrap items-center gap-2",
  barCentre: "flex items-center",
  crumb: "text-micro text-ink-45",
  actionRow: "flex flex-wrap items-center gap-1",
  account: "text-small text-ink hover:text-blue px-3",

  stage: "mx-auto w-full max-w-[1440px] px-5 py-6 md:px-8",
  pane: "flex min-h-0 flex-col",
  paneHead: "flex items-center justify-between gap-3 pb-3",
  paneTitle: "text-small text-ink font-medium",
  paneNote: "text-micro text-ink-45",
  ok: "text-micro text-blue flex items-center gap-1.5 font-medium",
  bad: "text-micro text-ink font-medium",

  stacked: "flex flex-col gap-6",
  stackedRow: "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
  band: "flex h-[70vh] min-h-[460px] flex-col overflow-hidden rounded-panel",

  compact:
    "grid h-[calc(100dvh-150px)] grid-cols-1 gap-px overflow-hidden rounded-panel bg-ink-15 md:grid-cols-2 xl:grid-cols-4",
  compactPane: "flex min-h-0 flex-col overflow-hidden bg-ground p-5",

  schema: "flex h-full flex-col overflow-auto",
  schemaGroup: "mt-4 first:mt-0",
  schemaKey: "font-mono text-micro text-ink-45",
  schemaValue: "font-mono text-[13px] text-ink-70 mt-1",
  schemaList: "font-mono text-[13px] text-ink-70 mt-1",

  editorFill: "min-h-0 flex-1 overflow-auto rounded-panel",
  texText: "font-mono text-micro leading-[1.6] whitespace-pre-wrap text-ink",

  sheetScroll: "min-h-0 flex-1 overflow-auto",

  tuneWrap: "relative",
  tune: "pointer-events-none absolute top-[calc(100%+10px)] left-0 z-50 w-[min(92vw,860px)] origin-left scale-x-0 overflow-hidden rounded-panel bg-ground p-5 opacity-0 shadow-float",
  tuneOpen:
    "pointer-events-auto absolute top-[calc(100%+10px)] left-0 z-50 flex w-[min(92vw,860px)] origin-left flex-wrap items-start gap-x-10 gap-y-6 rounded-panel bg-ground p-5 opacity-100 shadow-float",
  tuneGroup: "flex flex-col gap-2.5",

  controlGroup: "relative flex flex-wrap items-center gap-1.5",
  controlLabel: "text-micro text-ink-45",

  picker: "flex flex-wrap items-center gap-1.5",
  pickChip:
    "bg-ground-sunken rounded-pill px-3.5 py-1.5 text-micro text-ink transition-colors duration-micro ease-out hover:bg-blue-wash focus:outline-2 focus:outline-blue",
  pickChipOn: "bg-ink rounded-pill px-3.5 py-1.5 text-micro text-white font-medium",

  popover:
    "bg-ground absolute top-[calc(100%+8px)] left-0 z-50 flex w-[320px] flex-col gap-1 rounded-panel p-2 shadow-float",
  popItem: "rounded-panel px-4 py-3 text-left text-small text-ink transition-colors duration-micro ease-out hover:bg-ground-sunken",
  popItemOn: "bg-blue-wash rounded-panel px-4 py-3 text-left text-small text-ink font-medium",
  popNote: "text-micro mt-1 block text-ink-45",
  chevron: "ml-1 inline",

  warning: "bg-blue-wash text-small text-ink mb-6 rounded-panel px-4 py-3",
  warningMark: "mr-1.5 inline",

  loading: "text-small text-ink-45 px-5 py-20",
} as const