"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface DigitalRainProps {
  color?: string
  speed?: number
  density?: number
  opacity?: number
}

export default function DigitalRain({
  color = "#0f0", // Matrix green by default
  speed = 1,
  density = 1,
  opacity = 0.05,
}: DigitalRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const { theme } = useTheme()

  // Adjust color based on theme
  const rainColor = theme === "dark" ? color : "#000"

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Update dimensions on resize
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Characters to use (mix of katakana, numbers, and symbols for a retro tech look)
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789<>?/\\|[]{}=+-*~"
    const charArray = chars.split("")

    // Column settings
    const fontSize = 14
    const columns = Math.floor((dimensions.width / fontSize) * density)

    // Drops - one per column, with random starting positions
    const drops: number[] = Array(columns)
      .fill(0)
      .map(() => Math.floor(Math.random() * -dimensions.height))

    // Character change frequency (lower = more changes)
    const changeFreq = 0.02

    // Character arrays for each column
    const columnChars: string[][] = Array(columns)
      .fill(0)
      .map(() =>
        Array(Math.ceil(dimensions.height / fontSize))
          .fill("")
          .map(() => charArray[Math.floor(Math.random() * charArray.length)]),
      )

    // Animation function
    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = `rgba(0, 0, 0, ${theme === "dark" ? 0.05 : 0.02})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set text color and font
      ctx.fillStyle = rainColor
      ctx.font = `${fontSize}px monospace`
      ctx.globalAlpha = opacity

      // Loop through each column
      for (let i = 0; i < columns; i++) {
        // Get current character for this column
        const x = i * fontSize
        const currentDrop = drops[i]

        // Draw characters in this column
        for (let j = 0; j < columnChars[i].length; j++) {
          const y = j * fontSize

          // Only draw if within visible area and below the drop point
          if (y >= currentDrop && y < dimensions.height) {
            // Fade out characters as they get further from the drop
            const distanceFromDrop = y - currentDrop
            const maxDistance = 15 * fontSize
            const fadeFactor = Math.max(0, 1 - distanceFromDrop / maxDistance)

            // First character is brighter (the "head" of the drop)
            const isHead = y === Math.floor(currentDrop / fontSize) * fontSize

            // Set opacity based on distance and if it's the head
            ctx.globalAlpha = isHead ? opacity * 2 : opacity * fadeFactor

            // Draw the character
            ctx.fillText(columnChars[i][j], x, y)

            // Randomly change characters
            if (Math.random() < changeFreq) {
              columnChars[i][j] = charArray[Math.floor(Math.random() * charArray.length)]
            }
          }
        }

        // Move drops down at varying speeds
        drops[i] += fontSize * speed * (0.5 + Math.random() * 0.5)

        // Reset drop when it reaches bottom
        if (drops[i] > dimensions.height + 100 * fontSize) {
          drops[i] = Math.random() * -100 * fontSize
        }
      }
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      draw()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [dimensions, rainColor, speed, density, opacity, theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity, pointerEvents: "none" }}
    />
  )
}
