import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"



const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        retro:
          "border-2 border-cyan-500 bg-transparent text-cyan-300 hover:bg-cyan-950/50 hover:text-cyan-300 transition-all duration-200",
        retroPink:
          "border-2 border-pink-500 bg-transparent text-pink-300 hover:bg-pink-950/50 hover:text-pink-300 transition-all duration-200",
        retroGreen:
          "border-2 border-green-500 bg-transparent text-green-300 hover:bg-green-950/50 hover:text-green-300 transition-all duration-200",
        retroYellow:
          "border-2 border-yellow-500 bg-transparent text-yellow-300 hover:bg-yellow-950/50 hover:text-yellow-300 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        style={{ position: "relative", zIndex: 20 }}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
