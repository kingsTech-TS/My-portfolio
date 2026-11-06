import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { API_URL } from "@/lib/api"

/**
 * Called by the admin dashboard after it changes projects or skills, so the public pages
 * (home, /projects, /about) show the change immediately instead of after the 5-minute cache.
 * Only admins can trigger it: the bearer token is checked against the backend.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const me = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: auth }, cache: "no-store" })
    if (!me.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 })
  }

  // every page under the root layout, plus the cached API fetches they made
  revalidatePath("/", "layout")
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() })
}
