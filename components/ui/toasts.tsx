"use client"

import { X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function Toasts() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex min-w-64 items-start gap-3 rounded-2xl border bg-card px-4 py-3 text-sm shadow-2xl ${
            toast.variant === "destructive" ? "border-red-500/60" : "border-line"
          }`}
        >
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand" />
          <div className="flex-1">
            {toast.title && <p className="font-medium text-white">{toast.title}</p>}
            {toast.description && <p className="text-muted">{toast.description}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} aria-label="Dismiss" className="text-muted hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
