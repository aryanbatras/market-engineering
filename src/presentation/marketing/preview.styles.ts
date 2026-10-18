export const previewStyles = {
  scroll: "min-h-0 flex-1 overflow-y-auto",
  root: "flex flex-col gap-7 px-6 pt-6 pb-8",

  header: "flex flex-col",
  name: "text-title text-ink",
  headline: "text-small text-ink-70 mt-3",
  meta: "text-micro text-ink-45 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1",
  metaIcon: "inline-flex items-center gap-1.5",

  links: "flex flex-wrap gap-2",
  link: "bg-ground rounded-pill px-3 py-1 text-micro text-ink-70",

  section: "flex flex-col gap-3",
  sectionLabel: "text-micro text-blue font-medium",
  entry: "flex flex-col gap-1 border-l-2 border-ground-sunken pl-4",
  entryTitle: "text-small text-ink font-medium",
  entryOrg: "text-small text-ink-70",
  entryMeta: "text-micro text-ink-45 flex flex-wrap items-center gap-x-3",
  entryBody: "text-small text-ink-70",
  bullet: "text-micro text-ink-70 flex items-start gap-2",
  bulletMark: "text-ink-45 mt-0.5",
  tags: "text-micro text-blue",

  empty: "text-small text-ink-45",
} as const