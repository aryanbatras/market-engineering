export const atsStyles = {
  root: "flex flex-col gap-5",
  heading: "text-small text-ink font-medium",
  note: "text-micro mt-1 text-ink-70",

  pane: "bg-ink text-white rounded-panel px-5 py-4",
  paneHead: "flex items-center justify-between gap-3",
  paneLabel: "font-mono text-micro text-ink-45",
  mockBadge: "rounded-pill border border-ink-45 px-2 py-0.5 font-mono text-micro text-ink-45",
  paneText: "mt-2 font-mono text-micro leading-[1.7] whitespace-pre-wrap text-white",

  verdictPass: "text-small text-blue font-medium",
  verdictFail: "text-small text-ink font-medium",

  list: "flex flex-col gap-3",
  finding: "border-l-2 border-ink-15 pl-4",
  findingWarning: "border-l-2 border-blue pl-4",
  findingKind: "font-mono text-micro text-ink-45",
  findingMessage: "mt-1 text-small text-ink-70",
} as const