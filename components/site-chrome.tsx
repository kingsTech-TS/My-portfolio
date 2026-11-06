"use client"

import type React from "react"
import { usePathname } from "next/navigation"

/** Public pages get the site header/footer and container; /admin renders its own full-screen shell. */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return <>{children}</>

  return (
    <div className="mx-auto max-w-7xl px-3 pb-6 pt-3 sm:px-4 sm:pt-4">
      {header}
      <main className="mt-5">{children}</main>
      {footer}
    </div>
  )
}
