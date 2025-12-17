import type { ReactNode } from "react"

interface RetroHeadingProps {
  children: ReactNode
}

export default function RetroHeading({ children }: RetroHeadingProps) {
  return (
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight font-pixel">
      {children}
    </h1>
  )
}
