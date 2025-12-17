"use client"

import { useState, type ReactNode } from "react"

interface RetroGlitchProps {
  children: ReactNode
}

export function RetroGlitch({ children }: RetroGlitchProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className={`inline-block relative ${isHovering ? "glitch" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      {isHovering && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-full opacity-70 text-red-500"
            style={{ clipPath: "polygon(0 30%, 100% 30%, 100% 50%, 0 50%)", transform: "translate(-2px, 0)" }}
          >
            {children}
          </div>
          <div
            className="absolute top-0 left-0 w-full h-full opacity-70 text-blue-500"
            style={{ clipPath: "polygon(0 60%, 100% 60%, 100% 75%, 0 75%)", transform: "translate(2px, 0)" }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}
