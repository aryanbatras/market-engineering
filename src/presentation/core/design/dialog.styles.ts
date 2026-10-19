export const dialogStyles = {
  scrim: "fixed inset-0 z-50 flex items-start justify-center bg-ink/20 p-4 pt-[12vh] backdrop-blur-[2px] md:p-8 md:pt-[14vh]",
  scrimRight: "fixed inset-0 z-50 flex items-start justify-end bg-ink/20 p-4 pt-[12vh] backdrop-blur-[2px] md:p-8 md:pt-[14vh]",

  panel: "bg-ground flex max-h-[76vh] w-full max-w-[560px] flex-col rounded-panel p-6 shadow-float outline-none md:p-8",

  head: "flex items-start justify-between gap-6",
  title: "text-lead text-ink",
  lead: "text-small text-ink-70 mt-2 max-w-[44ch]",
  close: "text-ink-45 hover:bg-ground-sunken hover:text-ink -mr-2 -mt-1 rounded-pill p-2 transition-colors duration-micro ease-out",

  body: "mt-6 flex min-h-0 flex-col gap-2 overflow-y-auto",

  option: "bg-ground-sunken hover:bg-blue-wash rounded-panel px-5 py-4 text-left transition-colors duration-micro ease-out focus:outline-2 focus:outline-blue",
  optionLabel: "text-small text-ink font-medium block",
  optionNote: "text-micro text-ink-70 mt-1 block",
} as const