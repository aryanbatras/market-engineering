export const previewStyles = {
  root: "bg-ground-sunken flex h-full min-h-0 flex-col gap-3 rounded-panel p-4 md:p-5",

  stage: "bg-ground min-h-0 flex-1 overflow-y-auto rounded-panel",
  content: "flex flex-col gap-7 px-6 py-7",

  header: "flex flex-col",
  name: "text-title text-ink",
  headline: "text-small text-ink-70 mt-3",
  meta: "text-micro text-ink-45 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1",
  metaItem: "inline-flex items-center gap-1.5",

  links: "flex flex-col gap-2",
  link: "bg-ground-sunken text-small text-ink flex items-center gap-3 rounded-panel px-4 py-3 hover:bg-blue-wash",
  linkIcon: "text-ink-45 shrink-0",
  linkLabel: "truncate",
  linkArrow: "text-ink-45 ml-auto shrink-0",

  section: "flex flex-col gap-4",
  sectionLabel: "text-micro text-blue font-medium",
  entry: "flex flex-col gap-1 border-l-2 border-ground-sunken pl-4",
  entryTitle: "text-small text-ink font-medium",
  entryOrg: "text-small text-ink-70",
  entryMeta: "text-micro text-ink-45 flex flex-wrap items-center gap-x-3",
  entryBody: "text-small text-ink-70",
  bullet: "text-micro text-ink-70 flex items-start gap-2",
  bulletMark: "text-ink-45 shrink-0",
  tags: "text-micro text-blue",

  empty: "text-small text-ink-70 px-6 py-10",
} as const