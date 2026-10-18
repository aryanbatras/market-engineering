const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const present = "Present"

export const formatResumeDate = (value: string | undefined, current: boolean): string => {
  if (current) return present
  if (!value) return ""
  const [year, month] = value.split("-")
  if (!month) return year ?? ""
  const index = Number.parseInt(month, 10) - 1
  const label = months[index]
  if (!label) return year ?? ""
  return `${label} ${year ?? ""}`
}

export const formatResumeRange = (
  start: string | undefined,
  end: string | undefined,
  current: boolean,
): string => {
  const from = formatResumeDate(start, false)
  const to = formatResumeDate(end, current)
  if (from && to) return `${from} – ${to}`
  return from || to
}