"use client"

import type React from "react"
import { useState } from "react"
import { ArrowUpRight, Download, Github, Mail, MessageSquareMore, Send, Twitter } from "lucide-react"
import { Card, SectionLabel, AvailableBadge } from "@/components/bento"
import { useToast } from "@/components/ui/use-toast"
import { PROFILE } from "@/lib/data"

const LINKS = [
  { icon: Mail, label: PROFILE.email, href: `mailto:${PROFILE.email}` },
  { icon: Github, label: "github.com/theKingSi", href: "https://github.com/theKingSi?tab=repositories" },
  { icon: MessageSquareMore, label: "WhatsApp", href: "https://wa.link/mzkoo2" },
  { icon: Twitter, label: "x.com/oneboilikedat", href: "https://x.com/oneboilikedat" },
]

const field =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-base text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-brand"

export default function ContactPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulated submission (unchanged from the previous version)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setForm({ name: "", email: "", message: "" })
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-5">
      <Card glow="tr" className="px-7 py-10 sm:px-12 sm:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">Contact</p>
          <AvailableBadge />
        </div>
        <h1 className="mt-8 text-gradient text-4xl font-semibold tracking-tighter sm:text-5xl">Let&rsquo;s work together</h1>
        <p className="mt-3 max-w-lg text-base text-neutral-300 sm:text-lg">
          I&rsquo;m always open to new projects, creative ideas, or opportunities to be part of your vision.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        <Card className="px-7 py-10 sm:px-10 sm:py-12 md:col-span-3">
          <SectionLabel>Send a message</SectionLabel>
          {isSubmitted ? (
            <div className="mt-10">
              <p className="text-xl text-white">Message sent!</p>
              <p className="mt-2 text-neutral-300">Thanks for reaching out. I&rsquo;ll get back to you soon.</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 rounded-lg border border-line px-4 py-2.5 text-neutral-200 hover:border-neutral-500"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={field} />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className={field}
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Your message..."
                className={`${field} min-h-40 resize-y`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-stretch overflow-hidden rounded-full bg-brand font-medium text-white shadow-[0_8px_28px_-6px_rgba(232,71,43,0.8)] transition-colors hover:bg-brand-hi disabled:opacity-60"
              >
                <span className="py-2.5 pl-5 pr-3">{isSubmitting ? "Sending..." : "Send message"}</span>
                <span className="grid place-items-center pr-4">
                  <Send className="h-4 w-4" />
                </span>
              </button>
            </form>
          )}
        </Card>

        <div className="flex flex-col gap-5 md:col-span-2">
          <Card className="px-7 py-10 sm:px-10">
            <SectionLabel>Connect</SectionLabel>
            <ul className="mt-8 space-y-2">
              {LINKS.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-neutral-200 transition-colors hover:border-line hover:bg-ink/60"
                  >
                    <Icon className="h-4 w-4 text-brand" />
                    <span className="flex-1 truncate text-sm sm:text-base">{label}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-colors group-hover:text-brand" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={PROFILE.cv}
              download
              onClick={() => toast({ title: "Download started", description: "Your CV is downloading..." })}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-ink/60 px-4 py-2.5 text-neutral-200 transition-colors hover:border-brand hover:text-white"
            >
              <Download className="h-4 w-4" /> Download CV
            </a>
          </Card>

          <Card glow="bl" className="flex-1 px-7 py-10 sm:px-10">
            <SectionLabel>Office Hours</SectionLabel>
            <dl className="mt-6 space-y-3 text-base">
              {[
                ["Monday - Friday", "9:00 AM - 5:00 PM"],
                ["Saturday", "9:00 AM - 3:00 PM"],
                ["Sunday", "Closed"],
              ].map(([d, h]) => (
                <div key={d} className="flex justify-between gap-4">
                  <dt className="text-muted">{d}</dt>
                  <dd className="text-neutral-200">{h}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm text-neutral-400">Working remotely with clients around the globe.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
