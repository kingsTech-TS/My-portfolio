import type { Project } from "@/lib/data"

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "")

/** Skills grouped for display: { Frontend: [...], Backend: [...], Tools: [...] } */
export type SkillGroups = Record<string, string[]>

const REVALIDATE = 300 // seconds; matches the API's cache headers

/** Published projects (managed in /admin). Empty if the API is unreachable. */
export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? (data as Project[]) : []
  } catch {
    return []
  }
}

/** Skills (managed in /admin/skills). Empty if the API is unreachable. */
export async function getSkills(): Promise<SkillGroups> {
  try {
    const res = await fetch(`${API_URL}/api/skills`, { next: { revalidate: REVALIDATE } })
    if (!res.ok) return {}
    const data = await res.json()
    return data && typeof data === "object" && !Array.isArray(data) ? (data as SkillGroups) : {}
  } catch {
    return {}
  }
}
