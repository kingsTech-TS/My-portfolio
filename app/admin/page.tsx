"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpToLine,
  CheckCircle2,
  ChevronRight,
  FileClock,
  FolderKanban,
  Github,
  GripVertical,
  ImageOff,
  Lock,
  Plus,
  Search,
  Star,
} from "lucide-react"
import { api, ApiError, BLOCKER_LABELS, type ProjectListItem } from "@/lib/admin-api"
import { useToast } from "@/components/ui/use-toast"
import { useAdmin } from "@/components/admin/admin-shell"
import { Badge, Btn, btnClass, Spinner } from "@/components/admin/ui"
import { cn } from "@/components/lib/utils"

type Filter = "all" | "draft" | "published"

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return "just now"
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  if (s < 86400 * 30) return `${Math.round(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
}: {
  label: string
  value: number | null
  icon: React.ComponentType<{ className?: string }>
  tone?: "neutral" | "green" | "amber" | "brand"
  hint?: string
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-xl",
            tone === "neutral" && "bg-white/5 text-neutral-300",
            tone === "green" && "bg-emerald-500/10 text-emerald-300",
            tone === "amber" && "bg-amber-500/10 text-amber-300",
            tone === "brand" && "bg-brand/10 text-brand-hi",
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-fg">{value ?? <span className="text-neutral-600">–</span>}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const { me, refreshMe } = useAdmin()
  const [items, setItems] = useState<ProjectListItem[] | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    api<{ items: ProjectListItem[] }>("/api/admin/projects")
      .then((r) => setItems(r.items))
      .catch((err) => {
        setItems([])
        if (err instanceof ApiError && err.status !== 401) toast({ title: "Could not load projects", description: err.message, variant: "destructive" })
      })
  }, [toast])

  useEffect(load, [load])

  // result of the GitHub OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const gh = params.get("github")
    if (!gh) return
    if (gh === "connected") {
      toast({ title: "GitHub connected" })
      refreshMe()
    } else {
      toast({ title: "GitHub connection failed", description: params.get("message") ?? undefined, variant: "destructive" })
    }
    window.history.replaceState(null, "", "/admin")
  }, [toast, refreshMe])

  async function connect() {
    setBusy(true)
    try {
      const { authorizeUrl } = await api<{ authorizeUrl: string }>("/api/github/connect")
      window.location.href = authorizeUrl
    } catch (err) {
      toast({ title: "Could not start GitHub login", description: (err as Error).message, variant: "destructive" })
      setBusy(false)
    }
  }

  async function disconnect() {
    if (!confirm("Disconnect GitHub? Imported projects stay on your portfolio.")) return
    setBusy(true)
    try {
      await api("/api/github/disconnect", { method: "DELETE" })
      refreshMe()
    } finally {
      setBusy(false)
    }
  }

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)

  /** Move the project at `from` to position `to` and save the new site order. */
  async function reorder(from: number, to: number) {
    if (!items || from === to || to < 0 || to >= items.length) return
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setItems(next)
    try {
      await api("/api/admin/projects/reorder", { method: "PUT", json: { ids: next.map((p) => p.id) } })
      if (to === 0) toast({ title: `"${moved.title}" is now first` })
    } catch (err) {
      toast({ title: "Could not save order", description: (err as Error).message, variant: "destructive" })
      load()
    }
  }

  function endDrag() {
    setDragIndex(null)
    setOverIndex(null)
  }

  const stats = useMemo(() => {
    if (!items) return null
    return {
      total: items.length,
      published: items.filter((p) => p.status === "published").length,
      draft: items.filter((p) => p.status === "draft").length,
      needImage: items.filter((p) => p.publishBlockers.includes("image_missing")).length,
    }
  }, [items])

  const q = search.trim().toLowerCase()
  const visible = (items ?? []).filter(
    (p) =>
      (filter === "all" || p.status === filter) &&
      (!q || p.title.toLowerCase().includes(q) || (p.repoFullName ?? "").toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))),
  )
  const canReorder = filter === "all" && !q
  const connected = me?.github.connected

  return (
    <div className="flex flex-col gap-6">
      {/* page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            Manage what appears on your portfolio. Drag rows (or use the arrows) to set the order on the site — #1 shows first.
          </p>
        </div>
        {connected ? (
          <Link href="/admin/import" className={btnClass("primary")}>
            <Plus className="h-4 w-4" /> Import from GitHub
          </Link>
        ) : (
          <Btn variant="primary" onClick={connect} loading={busy} disabled={me === null}>
            <Github className="h-4 w-4" /> Connect GitHub
          </Btn>
        )}
      </div>

      {/* GitHub banner */}
      {me && !connected && (
        <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-r from-brand/15 via-brand/5 to-transparent p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/20">
                <Github className="h-5 w-5 text-fg" />
              </span>
              <div>
                <p className="font-medium text-fg">Connect your GitHub account</p>
                <p className="text-sm text-neutral-300">See all your repositories and import them with one click.</p>
              </div>
            </div>
            <Btn variant="primary" onClick={connect} loading={busy}>
              Connect
            </Btn>
          </div>
        </div>
      )}

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total projects" value={stats?.total ?? null} icon={FolderKanban} />
        <StatCard label="Published" value={stats?.published ?? null} icon={CheckCircle2} tone="green" hint="Live on /projects" />
        <StatCard label="Drafts" value={stats?.draft ?? null} icon={FileClock} tone="amber" />
        <StatCard label="Missing image" value={stats?.needImage ?? null} icon={ImageOff} tone="brand" hint="Required to publish" />
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <div className="flex rounded-xl border border-line bg-ink/60 p-1" role="tablist">
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors",
                  filter === f ? "bg-white/10 text-fg" : "text-neutral-400 hover:text-fg",
                )}
              >
                {f === "all" ? "All" : f === "published" ? "Published" : "Drafts"}
                <span className="ml-1.5 text-xs text-neutral-500">
                  {stats ? (f === "all" ? stats.total : f === "published" ? stats.published : stats.draft) : ""}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, repos, tags"
              aria-label="Search projects"
              className="h-9 w-full rounded-xl border border-line bg-ink/60 pl-9 pr-3 text-sm text-fg placeholder:text-neutral-500 focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>
        </div>

        {!canReorder && items && items.length > 1 && (
          <p className="border-b border-line px-4 py-2 text-xs text-neutral-500">
            Switch to <span className="text-neutral-300">All</span> and clear the search to reorder projects.
          </p>
        )}

        {items === null ? (
          <div className="grid place-items-center py-20">
            <Spinner />
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5">
              <FolderKanban className="h-5 w-5 text-neutral-400" />
            </span>
            <p className="text-sm text-neutral-300">{items.length === 0 ? "No projects yet" : "Nothing matches"}</p>
            {items.length === 0 && connected && (
              <Link href="/admin/import" className={btnClass("secondary", "sm")}>
                Import your first repo
              </Link>
            )}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="hidden border-b border-line text-xs uppercase tracking-[0.08em] text-neutral-500 md:table-header-group">
              <tr>
                {canReorder && <th className="w-24 py-3 pl-4 font-medium">Order</th>}
                <th className={cn("py-3 font-medium", !canReorder && "pl-4")}>Project</th>
                <th className="py-3 font-medium">Status</th>
                <th className="hidden py-3 font-medium xl:table-cell">Stack</th>
                <th className="hidden py-3 font-medium lg:table-cell">Category</th>
                <th className="py-3 font-medium">Updated</th>
                <th className="w-12 py-3 pr-4" aria-label="Open" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((p) => {
                const index = items.indexOf(p)
                const href = `/admin/projects/${p.id}`
                return (
                  <tr
                    key={p.id}
                    draggable={canReorder}
                    onDragStart={(e) => {
                      if (!canReorder) return
                      setDragIndex(index)
                      e.dataTransfer.effectAllowed = "move"
                    }}
                    onDragOver={(e) => {
                      if (dragIndex === null) return
                      e.preventDefault()
                      if (overIndex !== index) setOverIndex(index)
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (dragIndex !== null) reorder(dragIndex, index)
                      endDrag()
                    }}
                    onDragEnd={endDrag}
                    className={cn(
                      "group transition-colors hover:bg-white/[0.02]",
                      dragIndex === index && "opacity-40",
                      overIndex === index && dragIndex !== null && dragIndex !== index && "bg-brand/10",
                    )}
                  >
                    {canReorder && (
                      <td className="py-3 pl-4 pr-2 align-middle">
                        <div className="flex items-center gap-1">
                          <GripVertical className="hidden h-4 w-4 cursor-grab text-neutral-600 group-hover:text-neutral-400 md:block" aria-hidden />
                          <span className={cn("w-6 text-center font-mono text-xs", index === 0 ? "font-semibold text-brand-hi" : "text-neutral-500")}>
                            {index + 1}
                          </span>
                          <div className="flex flex-col">
                            <button aria-label={`Move ${p.title} up`} title="Move up" onClick={() => reorder(index, index - 1)} disabled={index === 0} className="rounded p-0.5 text-neutral-400 hover:text-fg disabled:opacity-30">
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button aria-label={`Move ${p.title} down`} title="Move down" onClick={() => reorder(index, index + 1)} disabled={index === items.length - 1} className="rounded p-0.5 text-neutral-400 hover:text-fg disabled:opacity-30">
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                            aria-label={`Show ${p.title} first`}
                            title="Show first on the site"
                            onClick={() => reorder(index, 0)}
                            disabled={index === 0}
                            className="rounded p-1 text-neutral-400 hover:bg-white/5 hover:text-brand-hi disabled:invisible"
                          >
                            <ArrowUpToLine className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                    <td className={cn("py-3 pr-4", !canReorder && "pl-4")}>
                      <Link href={href} className="flex items-center gap-3">
                        <div className="relative h-11 w-[72px] shrink-0 overflow-hidden rounded-lg border border-line bg-ink">
                          {p.thumbnail ? (
                            <Image src={p.image || p.thumbnail} alt="" fill sizes="72px" className="object-cover object-top" />
                          ) : (
                            <div className="grid h-full place-items-center">
                              <ImageOff className="h-4 w-4 text-neutral-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-medium text-fg group-hover:text-brand-hi">
                            {p.title}
                            {p.isPrivateRepo && <Lock className="h-3 w-3 shrink-0 text-neutral-500" aria-label="Private repo" />}
                            {p.featured && <Star className="h-3 w-3 shrink-0 fill-amber-300 text-amber-300" aria-label="Featured on home page" />}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {p.status === "draft" && p.publishBlockers.length > 0 ? (
                              <span className="text-amber-300/90">{p.publishBlockers.map((b) => BLOCKER_LABELS[b] ?? b).join(" · ")}</span>
                            ) : (
                              p.repoFullName ?? p.codeUrl
                            )}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge tone={p.status === "published" ? "green" : "amber"}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", p.status === "published" ? "bg-emerald-400" : "bg-amber-400")} />
                        {p.status}
                      </Badge>
                    </td>
                    <td className="hidden py-3 pr-4 xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-md border border-line bg-ink/60 px-1.5 py-0.5 text-[11px] text-neutral-300">
                            {t}
                          </span>
                        ))}
                        {p.tags.length > 3 && <span className="px-1 text-[11px] text-neutral-500">+{p.tags.length - 3}</span>}
                      </div>
                    </td>
                    <td className="hidden py-3 pr-4 text-neutral-300 lg:table-cell">{p.category}</td>
                    <td className="hidden whitespace-nowrap py-3 pr-4 text-xs text-muted sm:table-cell">{timeAgo(p.updatedAt)}</td>
                    <td className="py-3 pr-4 text-right">
                      <Link href={href} aria-label={`Open ${p.title}`} className="inline-grid h-8 w-8 place-items-center rounded-lg text-neutral-500 hover:bg-white/5 hover:text-fg">
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {connected && (
        <p className="text-xs text-neutral-500">
          Connected to GitHub as @{me?.github.login} ·{" "}
          <button onClick={disconnect} disabled={busy} className="underline-offset-2 hover:text-neutral-300 hover:underline">
            Disconnect
          </button>
        </p>
      )}
    </div>
  )
}
