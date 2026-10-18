import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const typeScale = ["display", "title", "lead", "body", "small", "micro"] as const

const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...typeScale] }],
    },
  },
})

export const cn = (...inputs: ClassValue[]): string => merge(clsx(inputs))