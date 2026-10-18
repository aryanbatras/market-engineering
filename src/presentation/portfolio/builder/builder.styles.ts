export const builderStyles = {
  shell: "bg-ground-sunken min-h-dvh",

  picker: "mx-auto w-full max-w-[1440px] px-5 py-14 md:px-8 md:py-20",
  pickerTitle: "text-title text-ink",
  pickerBody: "text-body text-ink-70 mt-5 max-w-[48ch]",
  pickerGrid: "mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2",
  pickerSlot: "block w-full text-left",
  pickerSlotActive: "rounded-panel outline-2 outline-blue",

  layout: "mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]",
  panel: "flex flex-col gap-5",
  panelHeading: "text-small text-ink font-medium",
  panelNote: "text-micro text-ink-45",

  statusRow: "flex items-center justify-between gap-3",
  statusOk: "text-micro text-blue font-medium",
  statusBad: "text-micro text-ink font-medium",

  issueList: "flex flex-col gap-2",
  issue: "bg-ground rounded-panel px-4 py-3 text-micro text-ink",
  issueField: "text-blue font-medium",

  handleRow: "flex flex-col gap-2",
  handleInput:
    "bg-ground border-ink-15 rounded-pill border px-5 text-small h-11 focus:border-blue focus:outline-none",
  suggest: "text-micro text-blue self-start underline underline-offset-4",
  handleOk: "text-micro text-blue font-medium",
  handleBad: "text-micro text-ink font-medium",

  previewFrame: "bg-ground sticky top-[96px] h-[calc(100dvh-120px)] overflow-hidden rounded-panel",
  previewScroll: "h-full overflow-y-auto",
  previewHead: "bg-ground-sunken text-micro text-ink-45 flex items-center justify-between px-4 py-3",
  previewLink: "text-blue inline-flex items-center gap-1.5 underline underline-offset-4",

  toast: "bg-ink text-white fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-pill px-5 py-3 text-small",
  loading: "text-small text-ink-45 px-5 py-20",
} as const