export const copyPromptStyles = {
  wrap: "relative",
  trigger: "inline-flex",
  chevron: "ml-0.5 inline",

  panel:
    "bg-ground absolute top-[calc(100%+8px)] left-0 z-50 flex w-[340px] flex-col gap-1 rounded-panel p-2 shadow-float",
  panelWide: "bg-ground absolute top-[calc(100%+8px)] right-0 z-50 flex w-[340px] flex-col gap-1 rounded-panel p-2 shadow-float",

  item: "rounded-panel px-4 py-3 text-left transition-colors duration-micro ease-out hover:bg-ground-sunken focus:outline-2 focus:outline-blue",
  itemLabel: "text-small text-ink font-medium block",
  itemNote: "text-micro text-ink-45 mt-1 block",

  done: "text-micro text-ink-70 px-4 py-3",
  doneMark: "mr-1.5 inline",
} as const