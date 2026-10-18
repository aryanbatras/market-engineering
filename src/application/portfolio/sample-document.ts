import { z } from "zod"

export const handleSchema = z
  .string()
  .min(3, "Handle must be at least 3 characters")
  .max(30, "Handle must be 30 characters or fewer")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens")

export const monthYear = z
  .string()
  .regex(/^(\d{4}(-\d{2})?)$/, "Use YYYY-MM or YYYY")

export const year = z.string().regex(/^\d{4}$/, "Use YYYY")