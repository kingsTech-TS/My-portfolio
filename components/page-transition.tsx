"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { usePathname } from "next/navigation"

// Create context to manage transition state
type TransitionContextType = {
  isTransitioning: boolean
  previousPath: string | null
  currentPath: string | null
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  previousPath: null,
  currentPath: null,
})

export const useTransition = () => useContext(TransitionContext)

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<string | null>(pathname)

  useEffect(() => {
    // If the path changes, trigger transition
    if (pathname !== currentPath && currentPath !== null) {
      // Start transition
      setIsTransitioning(true)
      setPreviousPath(currentPath)

      // After transition animation completes, update current path
      const timer = setTimeout(() => {
        setCurrentPath(pathname)
        setIsTransitioning(false)
      }, 1000) // Match this with the CSS animation duration

      return () => clearTimeout(timer)
    }
  }, [pathname, currentPath])

  return (
    <TransitionContext.Provider value={{ isTransitioning, previousPath, currentPath }}>
      {children}

      {/* Transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 transition-effect">
            <div className="absolute inset-0 bg-black opacity-0 animate-crt-off"></div>
            <div className="absolute inset-0 vhs-glitch"></div>
            <div className="absolute inset-0 scanline"></div>
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  )
}
