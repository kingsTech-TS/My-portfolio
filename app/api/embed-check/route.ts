import { NextResponse } from "next/server"
import { API_URL } from "@/lib/api"
import { checkEmbeddable } from "@/lib/embed"

/**
 * Admin-only: can this live link be shown live in the home page phone mockup?
 * GET /api/embed-check?url=https://... (Authorization: Bearer <admin token>)
 * Restricted to admins because it makes the server fetch an arbitrary URL.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const me = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: auth }, cache: "no-store" })
    if (!me.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 502 })
  }

  const url = new URL(req.url).searchParams.get("url") ?? ""
  if (!url) return NextResponse.json({ embeddable: false, reason: "No live link" })
  return NextResponse.json(await checkEmbeddable(url))
}
