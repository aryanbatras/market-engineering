import { cva, type VariantProps } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-[background-color,color,transform] duration-micro ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      intent: {
        primary: "bg-ink text-white hover:bg-ink-70",
        accent: "bg-blue text-white hover:bg-blue-deep",
        secondary: "bg-ground-sunken text-ink hover:bg-blue-wash",
        ghost: "text-ink-70 hover:bg-ground-sunken hover:text-ink",
        quiet: "text-ink-70 underline underline-offset-4 hover:text-ink",
      },
      size: {
        primary: "h-12 rounded-pill px-7 text-body",
        small: "h-10 rounded-pill px-5 text-small",
        nav: "h-10 rounded-pill px-4 text-small",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "primary",
      block: false,
    },
  },
)

export type ButtonIntent = NonNullable<VariantProps<typeof buttonVariants>["intent"]>
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>