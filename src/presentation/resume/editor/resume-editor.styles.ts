export const editorStyles = {
  shell: "bg-ground-sunken min-h-dvh",
  bar: "bg-ground relative z-40",
  barInner: "mx-auto flex h-[72px] w-full max-w-[1440px] items-center justify-between px-5 md:px-8",
  barLeft: "flex items-center gap-4",
  crumb: "text-micro text-ink-45",
  actionRow: "flex items-center gap-3",

  layout: "mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-8 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
  side: "flex flex-col gap-6",

  heading: "text-title text-ink",
  lead: "text-body text-ink-70 mt-4 max-w-[46ch]",
  panel: "bg-ground rounded-panel p-5",
  panelHead: "flex items-center justify-between gap-3",
  panelHeading: "text-small text-ink font-medium",
  panelNote: "text-micro text-ink-70 mt-1",
  validRow: "inline-flex items-center gap-1.5",

  layoutList: "mt-4 grid grid-cols-2 gap-2",
  layoutButton:
    "bg-ground-sunken rounded-panel px-4 py-3 text-left text-small text-ink hover:bg-blue-wash focus:outline-2 focus:outline-blue",
  layoutButtonActive: "bg-blue-wash rounded-panel px-4 py-3 text-left text-small text-ink font-medium",
  layoutName: "text-small text-ink font-medium",
  layoutMeta: "text-micro text-ink-45 mt-1",

  configRow: "mt-4 flex flex-wrap items-center gap-3",
  configLabel: "text-micro text-ink-45",

  sourceFrame: "h-[360px]",
  statusOk: "text-micro text-blue font-medium",
  statusBad: "text-micro text-ink font-medium",

  sheetPane: "bg-ground sticky top-[96px] rounded-panel p-6",
  sheetHead: "flex items-baseline justify-between gap-4",
  sheetName: "text-small text-ink font-medium",
  sheetWarning: "text-micro text-ink font-medium",
  sheetBody: "mt-4",
  warningMark: "mr-1.5 inline",
  openLayouts: "mt-14 grid grid-cols-1 gap-2 lg:grid-cols-2",

  ats: "bg-ground rounded-panel p-6",

  toast: "bg-ink text-white fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill px-5 py-3 text-small",
  loading: "text-small text-ink-45 px-5 py-20",
} as const