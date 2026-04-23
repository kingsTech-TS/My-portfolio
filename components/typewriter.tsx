"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  text: string
  delay?: number
  deleteDelay?: number
  isDeleting?: boolean
  className?: string
  onComplete?: () => void
}

export function Typewriter({
  text,
  delay = 100,
  deleteDelay = 50,
  isDeleting = false,
  className = "",
  onComplete,
}: TypewriterProps) {
  const [currentText, setCurrentText] = useState(isDeleting ? text : "")

  useEffect(() => {
    if (!isDeleting) {
      // Typing forward
      if (currentText.length < text.length) {
        const timeout = setTimeout(() => {
          setCurrentText(text.slice(0, currentText.length + 1))
        }, delay)
        return () => clearTimeout(timeout)
      } else if (onComplete) {
        onComplete()
      }
    } else {
      // Deleting backward
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(text.slice(0, currentText.length - 1))
        }, deleteDelay)
        return () => clearTimeout(timeout)
      } else if (onComplete) {
        onComplete()
      }
    }
  }, [currentText, isDeleting, delay, deleteDelay, text, onComplete])

  return <span className={className}>{currentText}</span>
}
