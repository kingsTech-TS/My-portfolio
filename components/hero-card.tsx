"use client"

import Avatar from "@/components/avatar"
import Link from "next/link"
import { ArrowRight, Check, Copy } from "lucide-react"
import { useState } from "react"
import { Card, AvailableBadge } from "@/components/bento"
import { useToast } from "@/components/ui/use-toast"
import { PROFILE } from "@/lib/data"

export default function HeroCard({ projectCount }: { projectCount: number }) {
  const STATS = [
    { value: "4+", label: "Years building" },
    { value: `${projectCount}`, label: "Projects shipped" },
    { value: "Remote", label: "Worldwide" },
  ]
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: "Email copied", description: PROFILE.email })
    } catch {
      toast({ title: "Couldn't copy", description: PROFILE.email, variant: "destructive" })
    }
  }

  return (
    <Card glow="tr" className="px-7 py-8 sm:px-12 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">{PROFILE.role}</p>
        <AvailableBadge />
      </div>

      <div className="mt-10 flex flex-col-reverse items-start gap-10 sm:mt-14 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tighter sm:text-6xl">
            <span className="text-gradient">I&rsquo;m {PROFILE.name.split(" ")[0]}</span>
            <br />
            <span className="text-gradient">{PROFILE.name.split(" ").slice(1).join(" ")}</span>
            <span className="text-brand">.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg">{PROFILE.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="group/btn inline-flex items-center gap-2 rounded-full bg-brand py-2.5 pl-5 pr-2.5 text-sm font-medium text-fg shadow-[0_10px_30px_-8px_rgba(200,117,69,0.9)] transition-all hover:bg-brand-hi sm:text-base"
            >
              Hire me
              <span className="grid h-7 w-7 place-items-center rounded-full bg-black/20 transition-transform group-hover/btn:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>

            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-2.5 pl-5 pr-2.5 text-sm text-neutral-200 backdrop-blur transition-colors hover:border-white/25 hover:text-fg sm:text-base"
            >
              {copied ? "Copied!" : "Copy Email"}
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/5">
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-[conic-gradient(from_180deg,#c87545,transparent_40%,#c87545_70%,transparent)] opacity-40 blur-2xl" />
          <div className="relative rounded-full border border-white/10 bg-ink/60 p-2.5 backdrop-blur">
            <Avatar className="h-32 w-32 sm:h-44 sm:w-44" sizes="340px" priority />
          </div>
        </div>
      </div>

      <dl className="mt-12 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col-reverse px-2 first:pl-0 sm:px-6">
            <dt className="mt-1 text-xs text-muted sm:text-sm">{s.label}</dt>
            <dd className="text-xl font-semibold tracking-tight text-fg sm:text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}
