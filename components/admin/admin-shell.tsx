"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { DownloadCloud, ExternalLink, Github, LayoutDashboard, LogOut, Menu, Sparkles, X } from "lucide-react"
import { api, getToken, setToken, type GitHubStatus } from "@/lib/admin-api"
import { cn } from "@/components/lib/utils"
import { Spinner } from "@/components/admin/ui"

// ------------------------------------------------------------------ context
interface Me {
  id: string
  email: string
  github: GitHubStatus
}

const AdminContext = createContext<{ me: Me | null; refreshMe: () => void }>({ me: null, refreshMe: () => {} })
export const useAdmin = () => useContext(AdminContext)

// ------------------------------------------------------------------ nav
const NAV = [
  { href: "/admin", label: "Projects", icon: LayoutDashboard, match: (p: string) => p === "/admin" || p.startsWith("/admin/projects") },
  { href: "/admin/import", label: "Import from GitHub", icon: DownloadCloud, match: (p: string) => p.startsWith("/admin/import") },
  { href: "/admin/skills", label: "Skills", icon: Sparkles, match: (p: string) => p.startsWith("/admin/skills") },
]

function pageTitle(pathname: string) {
  if (pathname.startsWith("/admin/import")) return { section: "GitHub", title: "Import repositories" }
  if (pathname.startsWith("/admin/skills")) return { section: "Content", title: "Skills" }
  if (pathname.startsWith("/admin/projects/")) return { section: "Projects", title: "Workspace" }
  return { section: "Dashboard", title: "Projects" }
}

const noopSubscribe = () => () => {}

function DotLogo() {
  const dots: { x: number; y: number; d: number }[] = []
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 7; c++) {
      const d = Math.hypot(r - 3, c - 3)
      if (d <= 3.4) dots.push({ x: 8 + c * 8, y: 8 + r * 8, d })
    }
  return (
    <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={3} fill="#e8472b" opacity={1 - dot.d * 0.12} />
      ))}
    </svg>
  )
}

function Sidebar({ me, onNavigate, onSignOut }: { me: Me | null; onNavigate?: () => void; onSignOut: () => void }) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 px-5 py-5">
        <DotLogo />
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Portfolio</p>
          <p className="text-xs text-muted">Admin</p>
        </div>
      </Link>

      <nav className="mt-2 flex flex-col gap-1 px-3">
        <p className="px-3 pb-2 pt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">Manage</p>
        {NAV.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-white/[0.06] text-white" : "text-neutral-400 hover:bg-white/[0.03] hover:text-white",
              )}
            >
              {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-brand" />}
              <Icon className={cn("h-4 w-4", active ? "text-brand" : "text-neutral-500 group-hover:text-neutral-300")} />
              {label}
            </Link>
          )
        })}

        <p className="px-3 pb-2 pt-6 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-500">Site</p>
        <a
          href="/projects"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/[0.03] hover:text-white"
        >
          <ExternalLink className="h-4 w-4 text-neutral-500 group-hover:text-neutral-300" />
          View live portfolio
        </a>
      </nav>

      <div className="mt-auto flex flex-col gap-3 p-3">
        <div className="rounded-2xl border border-line bg-ink/60 p-3">
          <div className="flex items-center gap-3">
            {me?.github.connected && me.github.avatarUrl ? (
              <Image src={me.github.avatarUrl} alt="" width={32} height={32} className="rounded-full" unoptimized />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-full border border-line">
                <Github className="h-4 w-4 text-neutral-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">{me?.github.connected ? `@${me.github.login}` : "GitHub"}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <span className={cn("h-1.5 w-1.5 rounded-full", me?.github.connected ? "bg-emerald-400" : "bg-neutral-600")} />
                {me === null ? "Checking…" : me.github.connected ? "Connected" : "Not connected"}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-400 transition-colors hover:bg-white/[0.03] hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  )
}

/** Full-screen admin app shell with sidebar + top bar. The API enforces auth; this only handles redirects. */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLogin = pathname.startsWith("/admin/login")
  const hasToken = useSyncExternalStore(noopSubscribe, () => Boolean(getToken()), () => false)
  const [me, setMe] = useState<Me | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const refreshMe = useCallback(() => {
    api<Me>("/api/auth/me").then(setMe).catch(() => {})
  }, [])

  useEffect(() => {
    if (isLogin) return
    if (!getToken()) {
      router.replace("/admin/login")
      return
    }
    refreshMe()
  }, [isLogin, router, refreshMe])

  // close the mobile drawer with Escape
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileOpen])

  const signOut = () => {
    setToken(null)
    router.replace("/admin/login")
  }

  if (isLogin) return <>{children}</>
  if (!hasToken) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Spinner />
      </div>
    )
  }

  const { section, title } = pageTitle(pathname)
  const initial = me?.email?.[0]?.toUpperCase() ?? "·"

  return (
    <AdminContext.Provider value={{ me, refreshMe }}>
      <div className="min-h-screen">
        {/* desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line bg-card/80 backdrop-blur-xl lg:block">
          <Sidebar me={me} onSignOut={signOut} />
        </aside>

        {/* mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 border-r border-line bg-card">
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="absolute right-3 top-5 p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <Sidebar me={me} onNavigate={() => setMobileOpen(false)} onSignOut={signOut} />
            </aside>
          </div>
        )}

        <div className="lg:pl-64">
          {/* top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-ink/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="-ml-1 grid h-9 w-9 place-items-center rounded-lg text-neutral-300 hover:bg-white/5 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{section}</p>
              <p className="truncate text-sm font-medium text-white">{title}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <a
                href="/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-neutral-300 hover:text-white sm:inline-flex"
              >
                View site <ExternalLink className="h-3 w-3" />
              </a>
              <div
                title={me?.email}
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand to-orange-700 text-sm font-semibold text-white"
              >
                {initial}
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}
