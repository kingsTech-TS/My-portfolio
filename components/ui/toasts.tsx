"use client"

import { useToast } from "@/components/ui/use-toast"

export default function Toasts() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-[9999]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border-2 font-vt323 text-sm sm:text-base transition-all
            ${toast.variant === "destructive"
              ? "bg-red-900/80 border-red-500 text-red-200"
              : "bg-indigo-900/80 border-cyan-500 text-cyan-200"}
          `}
        >
          {toast.title && <h4 className="font-bold mb-1">{toast.title}</h4>}
          {toast.description && <p>{toast.description}</p>}
          <button
            onClick={() => removeToast(toast.id)}
            className="mt-2 text-xs text-gray-300 hover:text-white"
          >
            ✖ Close
          </button>
        </div>
      ))}
    </div>
  )
}
