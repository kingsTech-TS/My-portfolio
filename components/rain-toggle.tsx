"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Code } from "lucide-react"

interface RainToggleProps {
  onToggle: (isEnabled: boolean) => void
  initialState?: boolean
}

export default function RainToggle({ onToggle, initialState = true }: RainToggleProps) {
  const [isEnabled, setIsEnabled] = useState(initialState)

  const handleToggle = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    onToggle(newState)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={`fixed bottom-4 right-4 z-50 rounded-full w-10 h-10 border-2 btn-clickable ${
        isEnabled
          ? "border-green-500 bg-green-950/30 text-green-400 hover:bg-green-900/50 hover:text-green-300"
          : "border-gray-600 bg-gray-950/30 text-gray-400 hover:bg-gray-900/50 hover:text-gray-300"
      } transition-colors`}
      title={isEnabled ? "Disable Matrix Effect" : "Enable Matrix Effect"}
    >
      <Code className="h-5 w-5" />
    </Button>
  )
}
