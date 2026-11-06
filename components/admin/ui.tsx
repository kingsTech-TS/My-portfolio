"use client"

import type React from "react"
import { forwardRef } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/components/lib/utils"

/** Plain admin surface (no scroll animation, unlike the public bento Card). */
export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-line bg-card p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] sm:p-6",
        className,
      )}
    >
      {children}
    </section>
  )
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger"

/** Button styles, also usable on <Link> so links don't wrap <button>s. */
export function btnClass(variant: BtnVariant = "secondary", size: "sm" | "md" = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-5 text-sm",
    variant === "primary" && "bg-brand text-fg hover:bg-brand-hi",
    variant === "secondary" && "border border-line bg-ink/60 text-neutral-200 hover:border-neutral-500 hover:text-fg",
    variant === "ghost" && "text-neutral-400 hover:bg-white/5 hover:text-fg",
    variant === "danger" && "border border-red-500/40 text-red-300 hover:bg-red-500/10",
    className,
  )
}

export const Btn = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; loading?: boolean; size?: "sm" | "md" }
>(function Btn({ variant = "secondary", loading, size = "md", className, children, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={btnClass(variant, size, className)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})

export const inputClass =
  "w-full rounded-xl border border-line bg-ink/70 px-3.5 py-2.5 text-sm text-fg placeholder:text-neutral-500 focus:border-brand/70 focus:outline-none focus:ring-2 focus:ring-brand/20"

export const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(inputClass, className)} {...props} />
  },
)

export function Field({
  label,
  hint,
  htmlFor,
  children,
  aside,
}: {
  label: string
  hint?: React.ReactNode
  htmlFor?: string
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </div>
  )
}

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "neutral" | "green" | "amber" | "red" | "brand"
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em]",
        tone === "neutral" && "border-line text-neutral-300",
        tone === "green" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        tone === "amber" && "border-amber-500/30 bg-amber-500/10 text-amber-300",
        tone === "red" && "border-red-500/30 bg-red-500/10 text-red-300",
        tone === "brand" && "border-brand/40 bg-brand/10 text-brand-hi",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-muted", className)} />
}
