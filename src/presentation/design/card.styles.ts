export const cardClasses = {
  root: "bg-ground-sunken rounded-panel",
  inner: "p-8",
  quiet: "bg-ground border border-ink-15 rounded-panel",
} as const

export const cardLiftClasses = {
  interactive:
    "transition-[background-color,transform] duration-base ease-out hover:bg-blue-wash",
} as const
