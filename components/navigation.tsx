"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/components/lib/utils"

const LINKS = [
  { name: "About", path: "/about" },
  { name: "Portfolio", path: "/projects" },
  { name: "Contact", path: "/contact" },
]

// 7x7 grid of dots clipped to a circle
const DOTS: { x: number; y: number; d: number }[] = []
for (let r = 0; r < 7; r++) {
  for (let c = 0; c < 7; c++) {
    const d = Math.hypot(r - 3, c - 3)
    if (d <= 3.4) DOTS.push({ x: 8 + c * 8, y: 8 + r * 8, d })
  }
}

function DotLogo() {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      {DOTS.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={3} fill="#c87545" opacity={1 - dot.d * 0.12} />
      ))}
    </svg>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const glass = cn(
    "border border-white/10 backdrop-blur-xl transition-all duration-300",
    scrolled ? "bg-card/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)]" : "bg-card/90",
  )

  return (
    <header className="sticky top-3 z-50 flex items-center gap-1.5 sm:top-4">
      <Link
        href="/"
        aria-label="Home"
        className={cn(glass, "grid h-14 w-14 shrink-0 place-items-center rounded-full hover:rotate-90 sm:h-16 sm:w-16")}
      >
        <DotLogo />
      </Link>

      <nav className={cn(glass, "flex h-14 flex-1 items-center justify-around rounded-full px-1.5 sm:h-16 sm:px-6")}>
        {LINKS.map((link) => {
          const active = pathname === link.path
          return (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "relative rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors sm:px-6 sm:text-sm",
                active ? "text-fg" : "text-neutral-400 hover:text-fg",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-brand shadow-[0_8px_24px_-6px_rgba(200,117,69,0.8)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{link.name}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
