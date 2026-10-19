"use client"

import { toastStyles } from "./toast.styles"

type ToastProps = {
  message: string | null
}

export const Toast = ({ message }: ToastProps) => {
  if (!message) return null

  return (
    <div aria-live="polite" className={toastStyles.root} role="status">
      {message}
    </div>
  )
}