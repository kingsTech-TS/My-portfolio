import type { ReactNode } from "react"

interface NeonTextProps {
  children: ReactNode
  color?: "pink" | "cyan" | "yellow" | "green"
}

export function NeonText({ children, color = "cyan" }: NeonTextProps) {
  return <span className={`neon-text neon-${color}`}>{children}</span>
}
