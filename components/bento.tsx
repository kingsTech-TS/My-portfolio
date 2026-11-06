"use client"

import type React from "react"
import { useRef } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/components/lib/utils"
import type { Project } from "@/lib/data"
import LivePhoneScreen from "@/components/live-phone-screen"

type Glow = "tr" | "r" | "bl"

/**
 * Base bento card: fades up when scrolled into view and shows a soft
 * spotlight + glowing border that follows the cursor.
 */
export function Card({
  className,
  glow,
  delay = 0,
  lift = false,
  children,
}: {
  className?: string
  glow?: Glow
  delay?: number
  lift?: boolean
  children?: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={lift && !reduce ? { y: -6 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "spotlight relative overflow-hidden rounded-[28px] border border-line bg-card shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_20px_40px_-24px_rgba(0,0,0,0.8)]",
        glow && `glow-${glow}`,
        glow === "bl" && "border-l-brand/60 border-b-brand/60",
        glow === "tr" && "border-t-brand/50 border-r-brand/50",
        className,
      )}
    >
      {children}
    </motion.div>
  )
}

export function AvailableBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-300 backdrop-blur",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping-soft" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      Available for work
    </span>
  )
}

export function ArrowLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-fg shadow-[0_0_0_5px_rgba(200,117,69,0.15),0_10px_30px_-8px_rgba(200,117,69,0.8)] transition-all duration-300 hover:scale-110 hover:bg-brand-hi group-hover:rotate-45"
    >
      <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
    </a>
  )
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-neutral-400">
      <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_10px_2px_rgba(200,117,69,0.6)]" />
      {children}
    </h2>
  )
}

function ProjectHeader({ project, subtitle }: { project: Project; subtitle?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">{project.title}</h3>
        <p className="mt-1.5 text-sm text-muted sm:text-base">{subtitle ?? project.category}</p>
      </div>
      {project.hasLiveDemo !== false && project.demoUrl && (
        <ArrowLink href={project.demoUrl} label={`Open ${project.title}`} />
      )}
    </div>
  )
}

/** Project card with a stacked, tilted screenshot like the reference design. */
export function ProjectStackCard({
  project,
  subtitle,
  className,
  delay,
  children,
}: {
  project: Project
  subtitle?: string
  className?: string
  delay?: number
  children?: React.ReactNode
}) {
  return (
    <Card lift delay={delay} className={cn("group flex flex-col p-7 sm:p-10", className)}>
      <ProjectHeader project={project} subtitle={subtitle} />

      <div className="relative mx-auto mt-10 aspect-[16/11] w-[85%] max-w-md">
        <div className="absolute inset-0 translate-x-[9%] translate-y-[4%] rotate-[5deg] rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-300 to-neutral-500 opacity-80 shadow-2xl transition-transform duration-500 group-hover:translate-x-[13%] group-hover:rotate-[8deg]" />
        <div className="absolute inset-0 -rotate-[3deg] overflow-hidden rounded-2xl border-4 border-white bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:rotate-0 group-hover:scale-[1.04]">
          <Image
            src={project.image || "/placeholder-project.svg"}
            alt={`${project.title} screenshot`}
            fill
            sizes="(min-width: 768px) 400px, 80vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {children}
    </Card>
  )
}

/** Screenshot shown in the phone: the mobile screenshot if there is one, else the whole desktop shot. */
function PhoneScreenshot({ project }: { project: Project }) {
  if (project.mobileImage) {
    return (
      <Image
        src={project.mobileImage}
        alt={`${project.title} on mobile`}
        fill
        sizes="(min-width: 640px) 320px, 70vw"
        className="object-cover object-top"
      />
    )
  }
  // only a desktop screenshot: show all of it (like a phone showing a desktop site) over a blurred copy
  return (
    <>
      <Image
        src={project.image || "/placeholder-project.svg"}
        alt=""
        aria-hidden
        fill
        sizes="160px"
        className="scale-125 object-cover opacity-60 blur-2xl"
      />
      <div className="absolute inset-x-0 top-6 aspect-[16/10]">
        <Image
          src={project.image || "/placeholder-project.svg"}
          alt={`${project.title} screenshot`}
          fill
          sizes="(min-width: 640px) 320px, 70vw"
          className="object-contain object-top shadow-2xl"
        />
      </div>
    </>
  )
}

/** Phone status bar with the notch: the screen content starts below it, like a real phone. */
function PhoneStatusBar() {
  return (
    <div className="relative z-10 flex h-9 shrink-0 items-center justify-between bg-black px-6 text-[11px] font-semibold text-fg">
      <span>9:41</span>
      <div className="absolute left-1/2 top-1.5 h-6 w-[36%] -translate-x-1/2 rounded-full bg-neutral-950 ring-1 ring-white/5" />
      <span className="flex items-center gap-1" aria-hidden>
        <svg viewBox="0 0 18 12" className="h-2.5 w-3.5 fill-white">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" />
          <rect x="10" y="2.5" width="3" height="9.5" rx="0.5" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg viewBox="0 0 26 12" className="h-2.5 w-5">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke="white" strokeOpacity="0.5" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="white" />
          <rect x="23.5" y="4" width="1.5" height="4" rx="0.75" fill="white" fillOpacity="0.5" />
        </svg>
      </span>
    </div>
  )
}

/**
 * Tall card with a phone mockup. With `liveUrl` the phone renders the live site at real phone
 * width (true mobile layout); otherwise, or until it loads, it shows the screenshot.
 */
export function ProjectPhoneCard({
  project,
  subtitle,
  className,
  delay,
  liveUrl,
}: {
  project: Project
  subtitle?: string
  className?: string
  delay?: number
  liveUrl?: string
}) {
  return (
    <Card lift delay={delay} className={cn("group flex flex-col px-7 pt-7 sm:px-10 sm:pt-10", className)}>
      <ProjectHeader project={project} subtitle={subtitle} />

      <div className="relative mx-auto mt-auto w-[78%] max-w-[340px] pt-12">
        <div className="absolute inset-x-6 bottom-0 top-24 rounded-full bg-brand/25 blur-3xl" />
        <div className="relative h-[440px] rounded-t-[3.2rem] border-x-[10px] border-t-[10px] border-neutral-600 bg-neutral-900 shadow-[inset_0_0_0_2px_#111,0_0_0_1px_#888] transition-transform duration-500 group-hover:-translate-y-2 sm:h-[540px]">
          <div className="absolute inset-x-[6px] top-[6px] bottom-0 flex flex-col overflow-hidden rounded-t-[2.6rem] bg-black">
            <PhoneStatusBar />
            <div className="relative flex-1 overflow-hidden bg-neutral-900">
              {liveUrl ? (
                <LivePhoneScreen url={liveUrl} title={project.title} fallback={<PhoneScreenshot project={project} />} />
              ) : (
                <PhoneScreenshot project={project} />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

/** Infinite horizontal strip of tags. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div className="marquee-mask overflow-hidden">
      <div className="flex w-max animate-marquee gap-3 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-neutral-300"
          >
            <span className="h-1 w-1 rounded-full bg-brand" />
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
