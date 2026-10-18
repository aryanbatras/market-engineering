import type { ButtonHTMLAttributes } from "react"
import { cn } from "./cn"
import { buttonVariants, type ButtonIntent, type ButtonSize } from "./button.styles"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  intent?: ButtonIntent
  size?: ButtonSize
  block?: boolean
}

export const Button = ({
  intent,
  size,
  block,
  className,
  type = "button",
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    className={cn(buttonVariants({ intent, size, block }), className)}
    {...rest}
  />
)
