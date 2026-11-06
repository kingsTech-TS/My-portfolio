"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DownloadCloud, ImageUp, Sparkles } from "lucide-react"
import { api, ApiError, setToken } from "@/lib/admin-api"
import { Btn, Field, TextInput } from "@/components/admin/ui"

const FEATURES = [
  { icon: DownloadCloud, title: "Import from GitHub", text: "Live URL and tech stack detected automatically." },
  { icon: Sparkles, title: "AI descriptions", text: "A catchy blurb written from each README." },
  { icon: ImageUp, title: "Edit, then publish", text: "Fine-tune everything in the project workspace." },
]

function DotLogo() {
  const dots: { x: number; y: number; d: number }[] = []
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++) {
      const d = Math.hypot(r - 3, c - 3)
      if (d <= 3.4) dots.push({ x: 8 + c * 8, y: 8 + r * 8, d })
    }
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden>
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={3} fill="#c87545" opacity={1 - dot.d * 0.12} />
      ))}
    </svg>
  )
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api<{ accessToken: string }>("/api/auth/login", { method: "POST", json: { email, password } })
      setToken(res.accessToken)
      router.replace("/admin")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reach the server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* brand panel */}
      <div className="relative hidden overflow-hidden border-r border-line bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0 glow-tr opacity-70" />
        <div className="relative flex items-center gap-3">
          <DotLogo />
          <div className="leading-tight">
            <p className="font-semibold text-fg">Portfolio</p>
            <p className="text-sm text-muted">Admin</p>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-gradient max-w-md text-4xl font-semibold leading-tight tracking-tighter">
            Turn your repositories into portfolio projects.
          </h2>
          <ul className="mt-10 flex flex-col gap-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-ink/60">
                  <Icon className="h-4 w-4 text-brand-hi" />
                </span>
                <div>
                  <p className="text-sm font-medium text-fg">{title}</p>
                  <p className="text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-neutral-500">Only the portfolio owner can sign in.</p>
      </div>

      {/* form */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <DotLogo />
            <p className="font-semibold text-fg">Portfolio Admin</p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Welcome back</h1>
          <p className="mt-1.5 text-sm text-muted">Sign in to manage your projects.</p>

          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <Field label="Email" htmlFor="email">
              <TextInput
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <TextInput
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            {error && (
              <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
            <Btn type="submit" variant="primary" loading={loading} className="mt-1 w-full">
              Sign in
            </Btn>
          </form>
          <Link href="/" className="mt-8 block text-center text-xs text-neutral-500 hover:text-neutral-300">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}
