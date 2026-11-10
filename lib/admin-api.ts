"use client"

import { API_URL } from "@/lib/api"
import type { Category } from "@/lib/data"

const TOKEN_KEY = "portfolio_admin_token"

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable */
  }
}

export class ApiError extends Error {
  status: number
  code?: string
  data: Record<string, unknown>
  constructor(status: number, message: string, code?: string, data: Record<string, unknown> = {}) {
    super(message)
    this.status = status
    this.code = code
    this.data = data
  }
}

export async function api<T = unknown>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const headers = new Headers(init.headers)
  const token = getToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  let body = init.body
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json")
    body = JSON.stringify(init.json)
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers, body })
  // A 401 from /api/github/* means GitHub rejected the stored GitHub token
  // (revoked/expired), not that the admin session is invalid — don't log out.
  if (res.status === 401 && path.startsWith("/api/github/")) {
    throw new ApiError(401, "GitHub token is invalid or expired. Reconnect GitHub.", "github_not_connected")
  }
  if (res.status === 401 && path !== "/api/auth/login") {
    setToken(null)
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
      window.location.href = "/admin/login"
    }
  }
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const detail = data?.detail
    if (detail && typeof detail === "object" && !Array.isArray(detail)) {
      throw new ApiError(res.status, detail.message ?? "Request failed", detail.code, detail)
    }
    if (Array.isArray(detail)) {
      // FastAPI validation error
      const msg = detail.map((d: { loc?: string[]; msg: string }) => `${d.loc?.slice(1).join(".")}: ${d.msg}`).join("; ")
      throw new ApiError(res.status, msg, "validation_error")
    }
    throw new ApiError(res.status, typeof detail === "string" ? detail : data?.error ?? `HTTP ${res.status}`)
  }
  const method = (init.method ?? "GET").toUpperCase()
  if (method !== "GET" && (path.startsWith("/api/admin/") || path.startsWith("/api/github/import"))) {
    refreshPublicSite()
  }
  return data as T
}

let refreshTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Ask the Next.js app to rebuild the public pages so admin changes show up right away
 * (see app/api/revalidate/route.ts). Debounced: a burst of edits triggers one refresh.
 */
export function refreshPublicSite() {
  if (typeof window === "undefined") return
  if (refreshTimer) clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => {
    const token = getToken()
    if (!token) return
    fetch("/api/revalidate", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
  }, 400)
}

// ------------------------------------------------------------------ types
export type StackCategory =
  | "framework" | "language" | "styling" | "ui" | "state" | "data" | "backend"
  | "database" | "auth" | "animation" | "testing" | "tooling" | "deploy" | "other"

export interface StackItem {
  name: string
  category: StackCategory
  source: "detected" | "manual"
  evidence: string | null
  hidden: boolean
  priority: number
}

export interface PublicProject {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl: string
  hasLiveDemo: boolean
  codeUrl: string
  category: Exclude<Category, "All">
  featured: boolean
  mobileImage: string
}

export interface ProjectListItem extends PublicProject {
  status: "draft" | "published"
  repoFullName: string | null
  order: number
  thumbnail: string | null
  publishBlockers: string[]
  isPrivateRepo: boolean
  updatedAt: string
}

export interface Workspace {
  id: string
  status: "draft" | "published"
  githubRepoId: number | null
  repoFullName: string | null
  title: string
  description: string
  descriptionSource: "ai" | "github" | "manual"
  descriptionHistory: { text: string; source: string; createdAt: string }[]
  image: { url: string; cardUrl: string; publicId: string; width: number | null; height: number | null } | null
  mobileImage: { url: string; phoneUrl: string; publicId: string; width: number | null; height: number | null } | null
  stack: StackItem[]
  extraTags: string[]
  tags: string[]
  demoUrl: string
  demoUrlSource: string | null
  demoUrlStatus: { ok: boolean; statusCode: number | null; checkedAt: string } | null
  codeUrl: string
  showCode: boolean
  featured: boolean
  category: Exclude<Category, "All">
  isPrivateRepo: boolean
  stars: number
  order: number
  lockedFields: string[]
  publishBlockers: string[]
  lastSyncedAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  preview: PublicProject
}

export interface Repo {
  id: number
  fullName: string
  name: string
  owner: string
  description: string | null
  htmlUrl: string
  homepage: string | null
  language: string | null
  topics: string[]
  stars: number
  private: boolean
  fork: boolean
  archived: boolean
  updatedAt: string
  pushedAt: string
  imported: boolean
  projectId: string | null
}

export interface LiveUrlCandidate {
  url: string
  source: string
  ok: boolean | null
  status_code: number | null
}

export interface RepoPreview {
  repo: string
  title: string
  description: string
  descriptionSource: string
  category: string
  codeUrl: string
  demoUrl: string | null
  demoUrlSource: string | null
  liveUrlCandidates: LiveUrlCandidate[]
  stack: StackItem[]
  isPrivate: boolean
  alreadyImported: boolean
  projectId: string | null
}

export interface GitHubStatus {
  connected: boolean
  login?: string
  avatarUrl?: string
  scopes?: string[]
}

export const BLOCKER_LABELS: Record<string, string> = {
  image_missing: "Upload a cover image",
  title_missing: "Add a title",
  description_missing: "Add a description",
  code_url_missing: "Add the GitHub URL",
}
