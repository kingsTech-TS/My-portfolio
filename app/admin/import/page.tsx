"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, ExternalLink, Eye, GitFork, Lock, RefreshCw, Search, Star, X, XCircle } from "lucide-react"
import { api, ApiError, type Repo, type RepoPreview } from "@/lib/admin-api"
import { useToast } from "@/components/ui/use-toast"
import { useAdmin } from "@/components/admin/admin-shell"
import { Badge, Btn, btnClass, inputClass, Panel, Spinner, TextInput } from "@/components/admin/ui"
import { cn } from "@/components/lib/utils"

type ImportResult = { repo: string; status: "imported" | "skipped_existing" | "failed"; project_id?: string; error?: string }

const PER_PAGE = 20

function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  if (s < 86400 * 30) return `${Math.round(s / 86400)}d ago`
  if (s < 86400 * 365) return `${Math.round(s / 86400 / 30)}mo ago`
  return `${Math.round(s / 86400 / 365)}y ago`
}

function PreviewDrawer({
  repo,
  onClose,
  onImport,
  importing,
}: {
  repo: Repo
  onClose: () => void
  onImport: () => void
  importing: boolean
}) {
  const [data, setData] = useState<RepoPreview | null>(null)
  const [error, setError] = useState<string | null>(null)

  // the parent keys this component by repo, so state starts fresh for each repo
  useEffect(() => {
    api<RepoPreview>(`/api/github/repos/${repo.fullName}/preview`)
      .then(setData)
      .catch((e) => setError((e as Error).message))
  }, [repo.fullName])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <aside
        role="dialog"
        aria-label={`Preview ${repo.fullName}`}
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-line bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Import preview</p>
            <h2 className="mt-2 text-xl font-semibold text-fg">{repo.fullName}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 text-neutral-400 hover:text-fg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!data && !error && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-muted">
            <Spinner />
            Reading README, detecting stack and live URL…
          </div>
        )}
        {error && <p className="mt-6 text-sm text-red-300">{error}</p>}

        {data && (
          <div className="mt-6 flex flex-col gap-6 text-sm">
            <section>
              <h3 className="text-xs uppercase tracking-[0.14em] text-neutral-400">Title</h3>
              <p className="mt-1.5 text-fg">{data.title}</p>
            </section>
            <section>
              <h3 className="text-xs uppercase tracking-[0.14em] text-neutral-400">
                Description <span className="normal-case tracking-normal text-muted">({data.descriptionSource === "ai" ? "AI" : "from GitHub"})</span>
              </h3>
              <p className="mt-1.5 leading-relaxed text-neutral-200">{data.description}</p>
            </section>
            <section>
              <h3 className="text-xs uppercase tracking-[0.14em] text-neutral-400">Category</h3>
              <p className="mt-1.5 text-fg">{data.category}</p>
            </section>
            <section>
              <h3 className="text-xs uppercase tracking-[0.14em] text-neutral-400">Live URL</h3>
              {data.liveUrlCandidates.length === 0 && <p className="mt-1.5 text-muted">No live link found. You can add one in the workspace.</p>}
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {data.liveUrlCandidates.map((c) => (
                  <li key={c.url} className="flex items-center gap-2">
                    {c.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <XCircle className="h-4 w-4 shrink-0 text-red-400" />}
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className={cn("truncate hover:underline", c.url === data.demoUrl ? "text-fg" : "text-muted")}>
                      {c.url}
                    </a>
                    <span className="shrink-0 text-xs text-muted">{c.source}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="text-xs uppercase tracking-[0.14em] text-neutral-400">Detected stack</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.stack.map((s) => (
                  <span
                    key={s.name}
                    title={s.evidence ?? undefined}
                    className={cn("rounded-full border px-2.5 py-1 text-xs", s.hidden ? "border-line text-neutral-500 line-through" : "border-brand/40 bg-brand/10 text-neutral-100")}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted">Hover a tag to see why it was detected. Struck-through items are hidden by default.</p>
            </section>
            {data.isPrivate && (
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
                This repo is private: the &quot;View source&quot; link will be hidden by default.
              </p>
            )}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-8">
          {repo.imported && repo.projectId ? (
            <Link href={`/admin/projects/${repo.projectId}`} className={btnClass("primary", "md", "flex-1")}>
              Open workspace
            </Link>
          ) : (
            <Btn variant="primary" className="flex-1" onClick={onImport} loading={importing}>
              Import as draft
            </Btn>
          )}
          <Btn onClick={onClose}>Close</Btn>
        </div>
      </aside>
    </div>
  )
}

export default function ImportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { refreshMe } = useAdmin()
  const [repos, setRepos] = useState<Repo[] | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("")
  const [visibility, setVisibility] = useState<"all" | "public" | "private">("all")
  const [sort, setSort] = useState<"updated" | "pushed" | "created" | "full_name" | "stars">("updated")
  const [includeForks, setIncludeForks] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [previewing, setPreviewing] = useState<Repo | null>(null)
  const [importing, setImporting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(
    async (refresh = false) => {
      setRepos(null)
      setError(null)
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(PER_PAGE),
        visibility,
        sort,
        include_forks: String(includeForks),
        refresh: String(refresh),
      })
      if (query) params.set("search", query)
      try {
        const res = await api<{ items: Repo[]; total: number }>(`/api/github/repos?${params}`)
        setRepos(res.items)
        setTotal(res.total)
      } catch (e) {
        setRepos([])
        const notConnected = e instanceof ApiError && e.code === "github_not_connected"
        setError(notConnected ? "not_connected" : (e as Error).message)
        // the backend drops a revoked token — refresh so the dashboard shows "Connect GitHub"
        if (notConnected) refreshMe()
      }
    },
    [page, visibility, sort, includeForks, query, refreshMe],
  )

  useEffect(() => {
    load()
  }, [load])

  async function runImport(names: string[]) {
    setImporting(names.length === 1 ? names[0] : "__bulk__")
    try {
      const { results } = await api<{ results: ImportResult[] }>("/api/github/import", { method: "POST", json: { repos: names } })
      const ok = results.filter((r) => r.status === "imported")
      const failed = results.filter((r) => r.status === "failed")
      if (names.length === 1 && results[0].project_id && results[0].status !== "failed") {
        router.push(`/admin/projects/${results[0].project_id}`)
        return
      }
      toast({
        title: `Imported ${ok.length} of ${results.length}`,
        description: failed.length ? failed.map((f) => `${f.repo}: ${f.error}`).join("; ") : "Upload a cover image for each draft to publish it.",
        variant: failed.length ? "destructive" : "default",
      })
      if (names.length === 1 && failed.length) return
      setSelected(new Set())
      setPreviewing(null)
      load()
    } catch (e) {
      toast({ title: "Import failed", description: (e as Error).message, variant: "destructive" })
    } finally {
      setImporting(null)
    }
  }

  const pages = Math.max(1, Math.ceil(total / PER_PAGE))

  if (error === "not_connected") {
    return (
      <Panel className="text-center">
        <p className="text-neutral-300">Connect your GitHub account first.</p>
        <Link href="/admin" className={btnClass("primary", "md", "mt-4")}>
          Go to dashboard
        </Link>
      </Panel>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Panel>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">GitHub</p>
        <h1 className="mt-2 text-gradient text-3xl font-semibold tracking-tighter">Import repositories</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Imported repos become drafts. Their live URL, stack and an AI description are detected automatically. Upload a cover image in the workspace to publish.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <TextInput placeholder="Search repositories" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" aria-label="Search repositories" />
          </div>
          <select aria-label="Visibility" className={cn(inputClass, "w-auto")} value={visibility} onChange={(e) => { setVisibility(e.target.value as typeof visibility); setPage(1) }}>
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <select aria-label="Sort" className={cn(inputClass, "w-auto")} value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="updated">Recently updated</option>
            <option value="pushed">Recently pushed</option>
            <option value="created">Newest</option>
            <option value="stars">Most stars</option>
            <option value="full_name">Name</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={includeForks} onChange={(e) => { setIncludeForks(e.target.checked); setPage(1) }} className="accent-[#c87545]" />
            Forks
          </label>
          <Btn variant="ghost" size="sm" onClick={() => load(true)} aria-label="Refresh from GitHub">
            <RefreshCw className="h-4 w-4" />
          </Btn>
        </div>
      </Panel>

      <Panel className="p-0 sm:p-0">
        {selected.size > 0 && (
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 sm:px-7">
            <span className="text-sm text-neutral-300">{selected.size} selected</span>
            <Btn variant="primary" size="sm" loading={importing === "__bulk__"} onClick={() => runImport([...selected])}>
              Import selected
            </Btn>
          </div>
        )}

        {repos === null && (
          <div className="grid place-items-center py-16">
            <Spinner />
          </div>
        )}
        {error && error !== "not_connected" && <p className="p-6 text-sm text-red-300">{error}</p>}
        {repos?.length === 0 && !error && <p className="p-10 text-center text-sm text-muted">No repositories match.</p>}

        <ul className="divide-y divide-line">
          {repos?.map((r) => (
            <li key={r.id} className="flex items-center gap-4 px-5 py-4 sm:px-7">
              <input
                type="checkbox"
                aria-label={`Select ${r.fullName}`}
                disabled={r.imported}
                checked={selected.has(r.fullName)}
                onChange={(e) => {
                  const next = new Set(selected)
                  if (e.target.checked) next.add(r.fullName)
                  else next.delete(r.fullName)
                  setSelected(next)
                }}
                className="accent-[#c87545]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a href={r.htmlUrl} target="_blank" rel="noopener noreferrer" className="truncate font-medium text-fg hover:text-brand">
                    {r.fullName}
                  </a>
                  {r.private && (
                    <Badge>
                      <Lock className="h-3 w-3" /> private
                    </Badge>
                  )}
                  {r.fork && (
                    <Badge>
                      <GitFork className="h-3 w-3" /> fork
                    </Badge>
                  )}
                  {r.imported && <Badge tone="green">imported</Badge>}
                </div>
                {r.description && <p className="mt-1 line-clamp-1 text-sm text-muted">{r.description}</p>}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                  {r.language && <span>{r.language}</span>}
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3" /> {r.stars}
                  </span>
                  <span>Updated {timeAgo(r.updatedAt)}</span>
                  {r.homepage && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <ExternalLink className="h-3 w-3" /> {r.homepage.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Btn size="sm" variant="ghost" onClick={() => setPreviewing(r)} aria-label={`Preview ${r.fullName}`}>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </Btn>
                {r.imported && r.projectId ? (
                  <Link href={`/admin/projects/${r.projectId}`} className={btnClass("secondary", "sm")}>
                    Open
                  </Link>
                ) : (
                  <Btn size="sm" variant="primary" loading={importing === r.fullName} disabled={importing !== null} onClick={() => runImport([r.fullName])}>
                    Import
                  </Btn>
                )}
              </div>
            </li>
          ))}
        </ul>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-line px-5 py-3 text-sm text-muted sm:px-7">
            <span>
              Page {page} of {pages} · {total} repos
            </span>
            <div className="flex gap-2">
              <Btn size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Btn>
              <Btn size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
                Next
              </Btn>
            </div>
          </div>
        )}
      </Panel>

      {previewing && (
        <PreviewDrawer
          key={previewing.fullName}
          repo={previewing}
          onClose={() => setPreviewing(null)}
          importing={importing === previewing.fullName}
          onImport={() => runImport([previewing.fullName])}
        />
      )}
    </div>
  )
}
