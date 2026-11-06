"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

// Re-mounts on every navigation, giving each page a soft blur/fade-in.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // the admin dashboard is an app shell: no page-level blur that would re-flash the sidebar
  if (pathname.startsWith("/admin")) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)" }}
      // clear the filter afterwards: any `filter` value turns this div into the containing
      // block for position:fixed children and breaks their positioning
      animate={{ opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
