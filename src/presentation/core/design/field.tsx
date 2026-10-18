import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react"
import { cn } from "./cn"
import { fieldClasses } from "./field.styles"

type FieldShellProps = {
  label: string
  htmlFor: string
  help?: string
  error?: string
  children: ReactNode
  className?: string
}

export const Field = ({ label, htmlFor, help, error, children, className }: FieldShellProps) => (
  <div className={cn(fieldClasses.stack, className)}>
    <label className={fieldClasses.label} htmlFor={htmlFor}>
      {label}
    </label>
    {children}
    {error ? (
      <p className={fieldClasses.error} id={`${htmlFor}-error`}>
        <span aria-hidden className={fieldClasses.errorMark} />
        <span>{error}</span>
      </p>
    ) : help ? (
      <p className={fieldClasses.help} id={`${htmlFor}-help`}>
        {help}
      </p>
    ) : null}
  </div>
)

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const TextInput = ({ className, invalid = false, ...rest }: TextInputProps) => (
  <input
    className={cn(fieldClasses.control, fieldClasses.controlHeight, invalid && "border-blue", className)}
    aria-invalid={invalid || undefined}
    {...rest}
  />
)

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export const TextArea = ({ className, invalid = false, ...rest }: TextAreaProps) => (
  <textarea
    className={cn(fieldClasses.control, fieldClasses.controlTall, invalid && "border-blue", className)}
    aria-invalid={invalid || undefined}
    {...rest}
  />
)
