// Server-side only (used by the home page and /api/embed-check): fetches arbitrary live links.

export interface EmbedCheck {
  embeddable: boolean
  reason?: string
}

/**
 * Can this live link be shown inside an <iframe> (the home page phone mockup)?
 * Sites can forbid framing with X-Frame-Options or CSP frame-ancestors; browsers then show a
 * broken frame, so we check on the server and fall back to the screenshot. Cached for an hour.
 */
export async function checkEmbeddable(url: string): Promise<EmbedCheck> {
  if (!/^https:\/\//i.test(url)) {
    // an http:// page inside an https:// site is blocked as mixed content
    return { embeddable: false, reason: "The live link must use https://" }
  }
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; portfolio-embed-check)" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return { embeddable: false, reason: `The live site answered HTTP ${res.status}` }

    const xfo = res.headers.get("x-frame-options")?.toLowerCase()
    if (xfo && (xfo.includes("deny") || xfo.includes("sameorigin"))) {
      return { embeddable: false, reason: `The site blocks embedding (X-Frame-Options: ${xfo.toUpperCase()})` }
    }

    const csp = res.headers.get("content-security-policy") ?? ""
    const frameAncestors = csp
      .split(";")
      .map((d) => d.trim())
      .find((d) => d.toLowerCase().startsWith("frame-ancestors"))
    if (frameAncestors) {
      const sources = frameAncestors.split(/\s+/).slice(1)
      const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "")
      const allowed =
        sources.includes("*") ||
        (site !== "" && sources.some((s) => s !== "'none'" && s !== "'self'" && site.startsWith(s.replace(/\/$/, ""))))
      if (!allowed) return { embeddable: false, reason: "The site blocks embedding (CSP frame-ancestors)" }
    }
    return { embeddable: true }
  } catch {
    return { embeddable: false, reason: "The live site couldn't be reached" }
  }
}
