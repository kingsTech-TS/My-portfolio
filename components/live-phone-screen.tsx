"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/components/lib/utils"

/** CSS width of the simulated phone (iPhone 12–15). The site renders its real mobile layout at this width. */
const PHONE_VIEWPORT = 390

/**
 * Renders a live website inside the phone mockup at a true phone width, scaled down to fill the
 * screen exactly. `fallback` (the screenshot) shows until the site has loaded.
 * On touch devices the frame ignores touches so scrolling the page isn't captured by the iframe.
 */
export default function LivePhoneScreen({
  url,
  title,
  fallback,
}: {
  url: string
  title: string
  fallback: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = size ? size.w / PHONE_VIEWPORT : 1

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div className={cn("absolute inset-0 transition-opacity duration-500", loaded && "opacity-0")}>{fallback}</div>
      {size && size.w > 0 && (
        <iframe
          src={url}
          title={`${title}: live mobile preview`}
          loading="lazy"
          // no top-navigation: the embedded site can't redirect the portfolio page
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          style={{
            width: PHONE_VIEWPORT,
            height: size.h / scale,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className={cn(
            "absolute left-0 top-0 border-0 bg-white transition-opacity duration-500 [@media(hover:none)]:pointer-events-none",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </div>
  )
}
