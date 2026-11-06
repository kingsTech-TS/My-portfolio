"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  GripVertical,
  History,
  ImagePlus,
  Lock,
  RefreshCw,
  Sparkles,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react"
import { ProjectStackCard } from "@/components/bento"
import { useToast } from "@/components/ui/use-toast"
import { Badge, Btn, Field, inputClass, Panel, Spinner, TextInput } from "@/components/admin/ui"
import { cn } from "@/components/lib/utils"
import {
  api,
  ApiError,
  BLOCKER_LABELS,
  getToken,
  type LiveUrlCandidate,
  type StackCategory,
  type Workspace,
} from "@/lib/admin-api"
import type { Project } from "@/lib/data"

const MAX_DESCRIPTION = 160
const MAX_TAGS = 8
const MAX_IMAGE_MB = 5
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"]
const CATEGORIES = ["Web App", "Website", "Tools"] as const
const TONES = [
  { value: undefined, label: "Default" },
  { value: "punchy", label: "Punchy" },
  { value: "professional", label: "Professional" },
  { value: "playful", label: "Playful" },
] as const

type DraftStackItem = { name: string; hidden: boolean; category?: StackCategory; source?: "detected" | "manual"; evidence?: string | null }

interface Draft {
  title: string
  description: string
  demoUrl: string
  codeUrl: string
  showCode: boolean
  featured: boolean
  category: Workspace["category"]
  stack: DraftStackItem[]
  extraTags: string
}

type DraftKey = keyof Draft

function draftFrom(ws: Workspace): Draft {
  return {
    title: ws.title,
    description: ws.description,
    demoUrl: ws.demoUrl,
    codeUrl: ws.codeUrl,
    showCode: ws.showCode,
    featured: ws.featured,
    category: ws.category,
    stack: ws.stack.map((s) => ({ name: s.name, hidden: s.hidden, category: s.category, source: s.source, evidence: s.evidence })),
    extraTags: ws.extraTags.join(", "),
  }
}

const stackKey = (s: DraftStackItem[]) => JSON.stringify(s.map((i) => [i.name, i.hidden]))

function isFieldDirty(draft: Draft, base: Draft, key: DraftKey) {
  if (key === "stack") return stackKey(draft.stack) !== stackKey(base.stack)
  if (key === "extraTags") return parseTags(draft.extraTags).join("|") !== parseTags(base.extraTags).join("|")
  return draft[key] !== base[key]
}

function parseTags(s: string) {
  return s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

const DRAFT_KEYS: DraftKey[] = ["title", "description", "demoUrl", "codeUrl", "showCode", "featured", "category", "stack", "extraTags"]

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [ws, setWs] = useState<Workspace | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [candidates, setCandidates] = useState<LiveUrlCandidate[] | null>(null)
  const [stackDiff, setStackDiff] = useState<{ added: string[]; removed: string[] } | null>(null)
  const [relinkTo, setRelinkTo] = useState<string | null>(null)
  const [featuredConflict, setFeaturedConflict] = useState<{ id: string; title: string; status: string }[] | null>(null)
  const [newTag, setNewTag] = useState("")
  const [tone, setTone] = useState<(typeof TONES)[number]["value"]>(undefined)
  const dragIndex = useRef<number | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const mobileInput = useRef<HTMLInputElement>(null)
  const [embed, setEmbed] = useState<{ url: string; embeddable: boolean; reason?: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const base = useMemo(() => (ws ? draftFrom(ws) : null), [ws])
  const dirtyKeys = useMemo(
    () => (draft && base ? DRAFT_KEYS.filter((k) => isFieldDirty(draft, base, k)) : []),
    [draft, base],
  )
  const dirty = dirtyKeys.length > 0

  const wsRef = useRef<Workspace | null>(null)
  const draftRef = useRef<Draft | null>(null)
  useEffect(() => {
    wsRef.current = ws
    draftRef.current = draft
  }, [ws, draft])

  /** Take a fresh server copy. Unsaved edits are kept unless the field is in `force`. */
  const applyServer = useCallback((next: Workspace, force: DraftKey[] | "all" = []) => {
    const prevWs = wsRef.current
    const prevDraft = draftRef.current
    const fresh = draftFrom(next)
    let merged = fresh
    if (prevDraft && prevWs && force !== "all") {
      const prevBase = draftFrom(prevWs)
      merged = { ...fresh }
      for (const k of DRAFT_KEYS) {
        if (!force.includes(k) && isFieldDirty(prevDraft, prevBase, k)) {
          ;(merged as Record<DraftKey, unknown>)[k] = prevDraft[k]
        }
      }
    }
    wsRef.current = next
    draftRef.current = merged
    setWs(next)
    setDraft(merged)
  }, [])

  const fail = useCallback(
    (title: string, err: unknown) => toast({ title, description: (err as Error).message, variant: "destructive" }),
    [toast],
  )

  useEffect(() => {
    api<Workspace>(`/api/admin/projects/${id}`)
      .then((w) => applyServer(w, "all"))
      .catch((e) => (e instanceof ApiError && e.status === 404 ? setNotFound(true) : fail("Could not load project", e)))
  }, [id, applyServer, fail])

  // can the saved live link render live inside the home page phone mockup?
  const savedDemoUrl = ws?.demoUrl ?? ""
  useEffect(() => {
    if (!savedDemoUrl) return
    let cancelled = false
    fetch(`/api/embed-check?url=${encodeURIComponent(savedDemoUrl)}`, { headers: { Authorization: `Bearer ${getToken() ?? ""}` } })
      .then((r) => r.json())
      .then((d) => !cancelled && setEmbed({ url: savedDemoUrl, embeddable: Boolean(d.embeddable), reason: d.reason }))
      .catch(() => !cancelled && setEmbed({ url: savedDemoUrl, embeddable: false, reason: "Check failed" }))
    return () => {
      cancelled = true
    }
  }, [savedDemoUrl])

  // warn before leaving with unsaved edits
  useEffect(() => {
    if (!dirty) return
    const h = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", h)
    return () => window.removeEventListener("beforeunload", h)
  }, [dirty])

  const set = <K extends DraftKey>(key: K, value: Draft[K]) => setDraft((d) => (d ? { ...d, [key]: value } : d))

  // ------------------------------------------------------------------ save
  const save = useCallback(async (): Promise<Workspace | null> => {
    if (!draft || !base || !dirty) return ws
    const body: Record<string, unknown> = {}
    for (const k of dirtyKeys) {
      if (k === "stack") body.stack = draft.stack.map((s) => ({ name: s.name, hidden: s.hidden, category: s.category }))
      else if (k === "extraTags") body.extraTags = parseTags(draft.extraTags)
      else body[k] = typeof draft[k] === "string" ? (draft[k] as string).trim() : draft[k]
    }
    setBusy("save")
    try {
      const next = await api<Workspace>(`/api/admin/projects/${id}`, { method: "PATCH", json: body })
      applyServer(next, "all")
      toast({ title: "Saved" })
      return next
    } catch (e) {
      if (e instanceof ApiError && e.code === "relink_available") {
        setRelinkTo(String(e.data.repo))
      } else if (e instanceof ApiError && e.code === "featured_limit") {
        setFeaturedConflict(e.data.featured as { id: string; title: string; status: string }[])
      } else if (e instanceof ApiError && e.code === "already_imported") {
        toast({ title: "That repo is already another project", description: e.message, variant: "destructive" })
      } else {
        fail("Save failed", e)
      }
      return null
    } finally {
      setBusy(null)
    }
  }, [draft, base, dirty, dirtyKeys, id, ws, applyServer, toast, fail])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        save()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [save])

  async function run<T>(key: string, fn: () => Promise<T>, errTitle: string): Promise<T | null> {
    setBusy(key)
    try {
      return await fn()
    } catch (e) {
      fail(errTitle, e)
      return null
    } finally {
      setBusy(null)
    }
  }

  // ------------------------------------------------------------------ image
  async function uploadImage(file: File) {
    if (!IMAGE_TYPES.includes(file.type)) return toast({ title: "Use a PNG, JPEG, WebP or GIF image", variant: "destructive" })
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return toast({ title: `Image must be at most ${MAX_IMAGE_MB} MB`, variant: "destructive" })
    const form = new FormData()
    form.append("file", file)
    const next = await run("image", () => api<Workspace>(`/api/admin/projects/${id}/image`, { method: "PUT", body: form }), "Upload failed")
    if (next) {
      applyServer(next)
      toast({ title: "Image uploaded" })
    }
  }

  async function removeImage() {
    if (!confirm("Remove the cover image? A published project goes back to draft.")) return
    const next = await run("image", () => api<Workspace>(`/api/admin/projects/${id}/image`, { method: "DELETE" }), "Could not remove image")
    if (next) applyServer(next)
  }

  async function uploadMobileImage(file: File) {
    if (!IMAGE_TYPES.includes(file.type)) return toast({ title: "Use a PNG, JPEG, WebP or GIF image", variant: "destructive" })
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return toast({ title: `Image must be at most ${MAX_IMAGE_MB} MB`, variant: "destructive" })
    const form = new FormData()
    form.append("file", file)
    const next = await run(
      "mobile",
      () => api<Workspace>(`/api/admin/projects/${id}/mobile-image`, { method: "PUT", body: form }),
      "Upload failed",
    )
    if (next) {
      applyServer(next)
      toast({ title: "Mobile screenshot uploaded" })
    }
  }

  async function removeMobileImage() {
    const next = await run(
      "mobile",
      () => api<Workspace>(`/api/admin/projects/${id}/mobile-image`, { method: "DELETE" }),
      "Could not remove image",
    )
    if (next) applyServer(next)
  }

  /** Home page is full: unfeature `otherId`, then save this project as featured. */
  async function replaceFeatured(otherId: string) {
    const ok = await run(
      "featured",
      () => api(`/api/admin/projects/${otherId}`, { method: "PATCH", json: { featured: false } }),
      "Could not update featured projects",
    )
    if (ok === null) return
    setFeaturedConflict(null)
    await save()
  }

  // ------------------------------------------------------------------ description
  async function regenerate() {
    const res = await run(
      "regen",
      () => api<{ suggestion: string }>(`/api/admin/projects/${id}/description/regenerate`, { method: "POST", json: { tone, apply: false } }),
      "AI couldn't write a description",
    )
    if (res) setSuggestion(res.suggestion)
  }

  /** Puts the suggestion into the editor; it's saved with the other edits. */
  function acceptSuggestion() {
    if (suggestion) set("description", suggestion)
    setSuggestion(null)
  }

  async function restore(index: number) {
    const next = await run(
      "restore",
      () => api<Workspace>(`/api/admin/projects/${id}/description/restore`, { method: "POST", json: { index } }),
      "Restore failed",
    )
    if (next) applyServer(next, ["description"])
  }

  // ------------------------------------------------------------------ live URL
  async function detectLive() {
    const res = await run(
      "live-detect",
      () => api<{ candidates: LiveUrlCandidate[] }>(`/api/admin/projects/${id}/live-url/detect`, { method: "POST" }),
      "Detection failed",
    )
    if (res) setCandidates(res.candidates)
  }

  async function checkLive() {
    if (dirtyKeys.includes("demoUrl")) {
      await save()
      return
    }
    const next = await run("live-check", () => api<Workspace>(`/api/admin/projects/${id}/live-url/check`, { method: "POST" }), "Check failed")
    if (next) applyServer(next)
  }

  // ------------------------------------------------------------------ stack
  async function redetectStack(apply: boolean) {
    const res = await run(
      "stack",
      () =>
        api<{ added: string[]; removed: string[]; project: Workspace }>(`/api/admin/projects/${id}/stack/detect?apply=${apply}`, {
          method: "POST",
        }),
      "Stack detection failed",
    )
    if (!res) return
    if (apply) {
      applyServer(res.project, ["stack"])
      setStackDiff(null)
      toast({ title: "Stack updated" })
    } else if (res.added.length === 0 && res.removed.length === 0) {
      toast({ title: "Stack is up to date" })
    } else {
      setStackDiff({ added: res.added, removed: res.removed })
    }
  }

  function addStackItem() {
    const name = newTag.trim()
    if (!name || !draft) return
    if (draft.stack.some((s) => s.name.toLowerCase() === name.toLowerCase())) return setNewTag("")
    set("stack", [...draft.stack, { name, hidden: false, source: "manual", category: "other" }])
    setNewTag("")
  }

  function onDrop(target: number) {
    const from = dragIndex.current
    dragIndex.current = null
    if (from === null || from === target || !draft) return
    const next = [...draft.stack]
    const [item] = next.splice(from, 1)
    next.splice(target, 0, item)
    set("stack", next)
  }

  function moveStack(index: number, dir: -1 | 1) {
    if (!draft) return
    const target = index + dir
    if (target < 0 || target >= draft.stack.length) return
    const next = [...draft.stack]
    ;[next[index], next[target]] = [next[target], next[index]]
    set("stack", next)
  }

  // ------------------------------------------------------------------ repo / sync / publish
  async function relink() {
    if (!relinkTo) return
    const target = relinkTo
    setRelinkTo(null)
    const next = await run(
      "relink",
      () => api<Workspace>(`/api/admin/projects/${id}/relink`, { method: "POST", json: { repo: target, redetect: true } }),
      "Relink failed",
    )
    if (next) {
      applyServer(next, ["codeUrl", "stack", "demoUrl"])
      toast({ title: `Linked to ${next.repoFullName}` })
    }
  }

  async function resync() {
    const res = await run(
      "resync",
      () => api<{ changes: Record<string, unknown>; project: Workspace }>(`/api/admin/projects/${id}/resync`, { method: "POST" }),
      "Sync failed",
    )
    if (res) {
      applyServer(res.project)
      const keys = Object.keys(res.changes)
      toast({ title: keys.length ? `Updated from GitHub: ${keys.join(", ")}` : "Already up to date" })
    }
  }

  async function publish(publish: boolean) {
    if (publish && dirty) {
      const saved = await save()
      if (!saved) return
    }
    const next = await run(
      "publish",
      () => api<Workspace>(`/api/admin/projects/${id}/${publish ? "publish" : "unpublish"}`, { method: "POST" }),
      publish ? "Can't publish yet" : "Unpublish failed",
    )
    if (next) {
      applyServer(next)
      toast({ title: publish ? "Published to your portfolio" : "Moved back to drafts" })
    }
  }

  async function remove() {
    if (!confirm(`Delete "${ws?.title}"? This also deletes its image.`)) return
    const ok = await run("delete", () => api(`/api/admin/projects/${id}`, { method: "DELETE" }), "Delete failed")
    if (ok) router.replace("/admin")
  }

  // ------------------------------------------------------------------ render
  if (notFound) {
    return (
      <Panel className="text-center">
        <p className="text-neutral-300">Project not found.</p>
        <Link href="/admin" className="mt-4 inline-block text-brand hover:underline">
          Back to projects
        </Link>
      </Panel>
    )
  }
  if (!ws || !draft) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Spinner />
      </div>
    )
  }

  const visibleTags = [...draft.stack.filter((s) => !s.hidden).map((s) => s.name), ...parseTags(draft.extraTags)]
    .filter((t, i, arr) => arr.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i)
    .slice(0, MAX_TAGS)
  const previewProject: Project = {
    id: ws.id,
    title: draft.title || "Untitled",
    description: draft.description,
    image: ws.image?.cardUrl ?? "",
    tags: visibleTags,
    demoUrl: draft.demoUrl,
    hasLiveDemo: Boolean(draft.demoUrl),
    codeUrl: draft.showCode ? draft.codeUrl : "",
    category: draft.category,
    featured: draft.featured,
    mobileImage: ws.mobileImage?.phoneUrl ?? "",
  }
  const blockers = ws.publishBlockers
  const descLen = draft.description.trim().length
  const locked = (f: string) =>
    ws.lockedFields.includes(f) ? (
      <span title="Edited by hand: GitHub sync won't overwrite it" className="inline-flex items-center gap-1 text-[11px] text-muted">
        <Lock className="h-3 w-3" /> manual
      </span>
    ) : null

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* header */}
      <Panel className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/admin" aria-label="Back to projects" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-neutral-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold text-white sm:text-2xl">{ws.title}</h1>
              <Badge tone={ws.status === "published" ? "green" : "amber"}>{ws.status}</Badge>
              {ws.isPrivateRepo && (
                <Badge>
                  <Lock className="h-3 w-3" /> private repo
                </Badge>
              )}
            </div>
            {ws.repoFullName && <p className="mt-0.5 truncate text-sm text-muted">{ws.repoFullName}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {ws.repoFullName && (
            <Btn variant="ghost" size="sm" onClick={resync} loading={busy === "resync"} title="Refresh stars, stack, live URL and README from GitHub">
              <RefreshCw className="h-4 w-4" /> Sync
            </Btn>
          )}
          <Btn variant="danger" size="sm" onClick={remove} loading={busy === "delete"}>
            <Trash2 className="h-4 w-4" />
          </Btn>
          {ws.status === "published" ? (
            <Btn onClick={() => publish(false)} loading={busy === "publish"}>
              Unpublish
            </Btn>
          ) : (
            <Btn variant="primary" onClick={() => publish(true)} loading={busy === "publish"} disabled={blockers.length > 0} title={blockers.map((b) => BLOCKER_LABELS[b] ?? b).join(", ")}>
              Publish
            </Btn>
          )}
        </div>
      </Panel>

      {blockers.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-sm text-amber-200">
          To publish: {blockers.map((b) => BLOCKER_LABELS[b] ?? b).join(" · ")}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        {/* ---------------- form */}
        <div className="flex flex-col gap-5">
          {/* image */}
          <Panel>
            <Field label="Cover image (required)">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  const f = e.dataTransfer.files?.[0]
                  if (f) uploadImage(f)
                }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
                  dragOver ? "border-brand bg-brand/5" : "border-line",
                )}
              >
                {ws.image ? (
                  <div className="relative aspect-video">
                    <Image src={ws.image.cardUrl} alt="Cover" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover object-top" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    className="flex aspect-video w-full flex-col items-center justify-center gap-3 text-sm text-muted hover:text-neutral-200"
                  >
                    <ImagePlus className="h-8 w-8" />
                    Drop an image here or click to browse
                    <span className="text-xs">PNG, JPEG, WebP or GIF · max {MAX_IMAGE_MB} MB · 16:9 works best</span>
                  </button>
                )}
                {busy === "image" && (
                  <div className="absolute inset-0 grid place-items-center bg-black/60">
                    <Spinner className="text-white" />
                  </div>
                )}
              </div>
              <input
                ref={fileInput}
                type="file"
                accept={IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) uploadImage(f)
                  e.target.value = ""
                }}
              />
              {ws.image && (
                <div className="flex gap-2">
                  <Btn size="sm" onClick={() => fileInput.current?.click()} loading={busy === "image"}>
                    <Upload className="h-4 w-4" /> Replace
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={removeImage}>
                    Remove
                  </Btn>
                </div>
              )}
            </Field>
          </Panel>

          {/* mobile screenshot for the phone mockup */}
          <Panel>
            <Field
              label="Phone mockup"
              hint="When this project sits in the home page phone mockup, the live site is shown at phone width (its real mobile view). The screenshot below is the backup for sites that block embedding or are down. Take it at phone width (about 390px, e.g. Chrome DevTools → device toolbar → iPhone)."
            >
              {!ws.demoUrl ? (
                <p className="text-xs text-muted">No live link: the phone mockup will use the screenshot.</p>
              ) : embed?.url !== ws.demoUrl ? (
                <p className="flex items-center gap-2 text-xs text-muted">
                  <Spinner className="h-3.5 w-3.5" /> Checking whether the live site can be embedded…
                </p>
              ) : embed.embeddable ? (
                <p className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" /> The live site will render in the phone mockup as a mobile view.
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-xs text-amber-300">
                  <XCircle className="h-3.5 w-3.5" /> Live view unavailable ({embed.reason}). The screenshot will be used.
                </p>
              )}
              <div className="flex items-start gap-5">
                {/* mini phone preview */}
                <div className="relative w-28 shrink-0 rounded-[1.4rem] border-[5px] border-neutral-600 bg-black p-[3px] shadow-[0_0_0_1px_#888]">
                  <div className="relative aspect-[9/19] overflow-hidden rounded-[1rem] bg-neutral-900">
                    {ws.mobileImage ? (
                      <Image src={ws.mobileImage.phoneUrl} alt="Mobile screenshot" fill sizes="112px" className="object-cover object-top" />
                    ) : ws.image ? (
                      <>
                        <Image src={ws.image.cardUrl} alt="" aria-hidden fill sizes="60px" className="scale-125 object-cover opacity-60 blur-xl" />
                        <div className="absolute inset-x-0 top-5 aspect-[16/10]">
                          <Image src={ws.image.cardUrl} alt="Desktop screenshot fallback" fill sizes="112px" className="object-contain object-top" />
                        </div>
                      </>
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] text-neutral-500">No image</div>
                    )}
                    {busy === "mobile" && (
                      <div className="absolute inset-0 grid place-items-center bg-black/60">
                        <Spinner className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="absolute left-1/2 top-1 h-2.5 w-[38%] -translate-x-1/2 rounded-full bg-black" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <p className="text-neutral-300">
                    {ws.mobileImage
                      ? "Backup mobile screenshot set."
                      : "No mobile screenshot: the backup is the desktop screenshot scaled down, like the preview."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Btn size="sm" onClick={() => mobileInput.current?.click()} loading={busy === "mobile"}>
                      <Upload className="h-4 w-4" /> {ws.mobileImage ? "Replace" : "Upload"}
                    </Btn>
                    {ws.mobileImage && (
                      <Btn size="sm" variant="ghost" onClick={removeMobileImage}>
                        Remove
                      </Btn>
                    )}
                  </div>
                </div>
              </div>
              <input
                ref={mobileInput}
                type="file"
                accept={IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) uploadMobileImage(f)
                  e.target.value = ""
                }}
              />
            </Field>
          </Panel>

          {/* text fields */}
          <Panel className="flex flex-col gap-6">
            <Field label="Title" htmlFor="title" aside={locked("title")}>
              <TextInput id="title" value={draft.title} maxLength={80} onChange={(e) => set("title", e.target.value)} />
            </Field>

            <Field
              label="Description"
              htmlFor="description"
              aside={
                <span className="flex items-center gap-2">
                  {locked("description")}
                  <span className="text-[11px] text-muted">
                    {ws.descriptionSource === "ai" ? "AI-written" : ws.descriptionSource === "github" ? "from GitHub" : "edited"}
                  </span>
                </span>
              }
              hint={
                <span className={cn(descLen > MAX_DESCRIPTION && "text-amber-300")}>
                  {descLen}/{MAX_DESCRIPTION}
                  {descLen > MAX_DESCRIPTION && ". Cards look best under 160 characters"}
                </span>
              }
            >
              <textarea
                id="description"
                rows={4}
                maxLength={300}
                value={draft.description}
                onChange={(e) => set("description", e.target.value)}
                className={cn(inputClass, "resize-y leading-relaxed")}
              />
              <div className="flex flex-wrap items-center gap-2">
                <select aria-label="Tone" className={cn(inputClass, "h-8 w-auto py-0 text-xs")} value={tone ?? ""} onChange={(e) => setTone((e.target.value || undefined) as typeof tone)}>
                  {TONES.map((t) => (
                    <option key={t.label} value={t.value ?? ""}>
                      Tone: {t.label}
                    </option>
                  ))}
                </select>
                <Btn size="sm" onClick={regenerate} loading={busy === "regen"}>
                  <Sparkles className="h-4 w-4" /> Regenerate with AI
                </Btn>
                {ws.descriptionHistory.length > 0 && (
                  <Btn size="sm" variant="ghost" onClick={() => setShowHistory((v) => !v)}>
                    <History className="h-4 w-4" /> History ({ws.descriptionHistory.length})
                  </Btn>
                )}
              </div>
              {suggestion && (
                <div className="rounded-xl border border-brand/40 bg-brand/5 p-3">
                  <p className="text-sm leading-relaxed text-neutral-100">{suggestion}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Btn size="sm" variant="primary" onClick={acceptSuggestion}>
                      Use this
                    </Btn>
                    <Btn size="sm" onClick={regenerate} loading={busy === "regen"}>
                      Try again
                    </Btn>
                    <Btn size="sm" variant="ghost" onClick={() => setSuggestion(null)}>
                      Discard
                    </Btn>
                  </div>
                </div>
              )}
              {showHistory && (
                <ul className="flex flex-col gap-2 rounded-xl border border-line p-3">
                  {ws.descriptionHistory.map((h, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 text-sm">
                      <div>
                        <p className="text-neutral-200">{h.text}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {h.source} · {new Date(h.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Btn size="sm" variant="ghost" onClick={() => restore(i)} loading={busy === "restore"}>
                        Restore
                      </Btn>
                    </li>
                  ))}
                </ul>
              )}
            </Field>

            <Field
              label="Live URL"
              htmlFor="demoUrl"
              aside={locked("demo_url")}
              hint={
                ws.demoUrl && !dirtyKeys.includes("demoUrl") ? (
                  ws.demoUrlStatus ? (
                    ws.demoUrlStatus.ok ? (
                      <span className="inline-flex items-center gap-1 text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Reachable{ws.demoUrlSource ? ` · found via ${ws.demoUrlSource}` : ""}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-300">
                        <XCircle className="h-3.5 w-3.5" /> Not reachable{ws.demoUrlStatus.statusCode ? ` (HTTP ${ws.demoUrlStatus.statusCode})` : ""}
                      </span>
                    )
                  ) : (
                    "Not checked yet"
                  )
                ) : !draft.demoUrl ? (
                  "No live link. The card will hide the demo button."
                ) : (
                  "Save to check this URL"
                )
              }
            >
              <TextInput id="demoUrl" type="url" placeholder="https://…" value={draft.demoUrl} onChange={(e) => set("demoUrl", e.target.value)} />
              <div className="flex flex-wrap gap-2">
                {draft.demoUrl && (
                  <Btn size="sm" onClick={checkLive} loading={busy === "live-check"}>
                    Check
                  </Btn>
                )}
                {ws.repoFullName && (
                  <Btn size="sm" variant="ghost" onClick={detectLive} loading={busy === "live-detect"}>
                    <RefreshCw className="h-4 w-4" /> Re-detect
                  </Btn>
                )}
              </div>
              {candidates && (
                <div className="rounded-xl border border-line p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted">{candidates.length ? "Pick a URL" : "No candidates found"}</span>
                    <button aria-label="Close" onClick={() => setCandidates(null)} className="text-neutral-500 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {candidates.map((c) => (
                      <li key={c.url}>
                        <button
                          onClick={() => {
                            set("demoUrl", c.url)
                            setCandidates(null)
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-white/5"
                        >
                          {c.ok ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" /> : <XCircle className="h-4 w-4 shrink-0 text-red-400" />}
                          <span className="truncate text-neutral-200">{c.url}</span>
                          <span className="ml-auto shrink-0 text-xs text-muted">{c.source}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Field>

            <Field label="GitHub repository" htmlFor="codeUrl" aside={locked("code_url")}>
              <TextInput id="codeUrl" type="url" placeholder="https://github.com/owner/repo" value={draft.codeUrl} onChange={(e) => set("codeUrl", e.target.value)} />
              <label className="flex items-center gap-2 text-sm text-neutral-300">
                <input type="checkbox" checked={draft.showCode} onChange={(e) => set("showCode", e.target.checked)} className="accent-[#e8472b]" />
                Show &quot;View source&quot; link
                {ws.isPrivateRepo && <span className="text-xs text-amber-300">(private repo: visitors can&apos;t open it)</span>}
              </label>
              {relinkTo && (
                <div className="rounded-xl border border-brand/40 bg-brand/5 p-3 text-sm">
                  <p className="text-neutral-100">
                    <strong>{relinkTo}</strong> is a different repository. Link this project to it and re-detect the stack and live URL?
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Btn size="sm" variant="primary" onClick={relink} loading={busy === "relink"}>
                      Relink project
                    </Btn>
                    <Btn
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setRelinkTo(null)
                        set("codeUrl", ws.codeUrl)
                      }}
                    >
                      Cancel
                    </Btn>
                  </div>
                </div>
              )}
            </Field>

            <Field label="Category" htmlFor="category" aside={locked("category")}>
              <select id="category" className={inputClass} value={draft.category} onChange={(e) => set("category", e.target.value as Draft["category"])}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            <label className="flex items-start gap-3 rounded-xl border border-line bg-ink/40 p-3 text-sm">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="mt-0.5 accent-[#e8472b]"
              />
              <span>
                <span className="block text-neutral-100">Feature on the home page</span>
                <span className="block text-xs text-muted">
                  Up to 3 projects. By site order: the 1st and 3rd show as cards, the 2nd in the phone mockup
                  {ws.status !== "published" && " (only published projects appear)"}.
                </span>
              </span>
            </label>
            {featuredConflict && (
              <div className="rounded-xl border border-brand/40 bg-brand/5 p-3 text-sm">
                <p className="text-neutral-100">The home page already shows 3 featured projects. Replace one:</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {featuredConflict.map((f) => (
                    <li key={f.id} className="flex items-center justify-between gap-3">
                      <span className="truncate text-neutral-300">
                        {f.title}
                        {f.status !== "published" && <span className="ml-1.5 text-xs text-muted">({f.status})</span>}
                      </span>
                      <Btn size="sm" onClick={() => replaceFeatured(f.id)} loading={busy === "featured" || busy === "save"}>
                        Replace
                      </Btn>
                    </li>
                  ))}
                </ul>
                <Btn
                  size="sm"
                  variant="ghost"
                  className="mt-2"
                  onClick={() => {
                    setFeaturedConflict(null)
                    set("featured", false)
                  }}
                >
                  Cancel
                </Btn>
              </div>
            )}
          </Panel>

          {/* stack */}
          <Panel className="flex flex-col gap-4">
            <Field
              label="Tech stack"
              aside={locked("stack")}
              hint={`Drag to reorder, click the eye to hide. The first ${MAX_TAGS} visible items show on the card. Hover for detection evidence.`}
            >
              <ul className="flex flex-wrap gap-2">
                {draft.stack.map((s, i) => (
                  <li
                    key={s.name}
                    draggable
                    onDragStart={() => (dragIndex.current = i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(i)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") moveStack(i, -1)
                      if (e.key === "ArrowRight") moveStack(i, 1)
                    }}
                    tabIndex={0}
                    title={s.evidence ?? (s.source === "manual" ? "Added manually" : undefined)}
                    className={cn(
                      "flex cursor-grab items-center gap-1 rounded-full border py-1 pl-1.5 pr-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 active:cursor-grabbing",
                      s.hidden ? "border-line text-neutral-500" : "border-brand/40 bg-brand/10 text-neutral-100",
                    )}
                  >
                    <GripVertical className="h-3.5 w-3.5 text-neutral-500" />
                    <span className={cn(s.hidden && "line-through")}>{s.name}</span>
                    <button
                      aria-label={s.hidden ? `Show ${s.name}` : `Hide ${s.name}`}
                      onClick={() => set("stack", draft.stack.map((x, j) => (j === i ? { ...x, hidden: !x.hidden } : x)))}
                      className="rounded-full p-1 hover:bg-white/10"
                    >
                      {s.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    {s.source === "manual" && (
                      <button
                        aria-label={`Remove ${s.name}`}
                        onClick={() => set("stack", draft.stack.filter((_, j) => j !== i))}
                        className="rounded-full p-1 hover:bg-white/10"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <TextInput
                  placeholder="Add technology (e.g. Supabase)"
                  value={newTag}
                  maxLength={40}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addStackItem()
                    }
                  }}
                />
                <Btn onClick={addStackItem} disabled={!newTag.trim()}>
                  Add
                </Btn>
              </div>
            </Field>
            {ws.repoFullName && (
              <div>
                <Btn size="sm" variant="ghost" onClick={() => redetectStack(false)} loading={busy === "stack"}>
                  <RefreshCw className="h-4 w-4" /> Re-detect stack
                </Btn>
              </div>
            )}
            {stackDiff && (
              <div className="rounded-xl border border-line p-3 text-sm">
                {stackDiff.added.length > 0 && <p className="text-emerald-300">+ {stackDiff.added.join(", ")}</p>}
                {stackDiff.removed.length > 0 && <p className="text-red-300">− {stackDiff.removed.join(", ")}</p>}
                <p className="mt-1 text-xs text-muted">Manually added items are kept.</p>
                <div className="mt-3 flex gap-2">
                  <Btn size="sm" variant="primary" onClick={() => redetectStack(true)} loading={busy === "stack"}>
                    Apply changes
                  </Btn>
                  <Btn size="sm" variant="ghost" onClick={() => setStackDiff(null)}>
                    Dismiss
                  </Btn>
                </div>
              </div>
            )}

            <Field label="Extra tags" htmlFor="extraTags" hint="Comma-separated. Shown after the stack, e.g. NASA API, Canvas.">
              <TextInput id="extraTags" value={draft.extraTags} onChange={(e) => set("extraTags", e.target.value)} />
            </Field>
          </Panel>
        </div>

        {/* ---------------- preview */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Live preview</p>
          <ProjectStackCard project={previewProject} className="w-full">
            <p className="mt-10 text-base leading-relaxed text-neutral-300">{previewProject.description || <span className="text-muted">No description</span>}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {previewProject.tags.map((t) => (
                <span key={t} className="rounded-full border border-line bg-ink/60 px-3 py-1 text-xs text-neutral-300">
                  {t}
                </span>
              ))}
            </div>
          </ProjectStackCard>
        </div>
      </div>

      {/* save bar */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 lg:pl-64">
          <div className="flex items-center gap-3 rounded-full border border-line bg-card/95 py-2 pl-5 pr-2 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur">
            <span className="text-sm text-neutral-300">Unsaved changes</span>
            <Btn size="sm" variant="ghost" onClick={() => base && setDraft(base)}>
              Discard
            </Btn>
            <Btn size="sm" variant="primary" onClick={save} loading={busy === "save"}>
              Save
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}
