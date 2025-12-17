"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RetroGlitch } from "./retro-glitch"

export default function BootSequence() {
  const [bootStage, setBootStage] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showBootSequence, setShowBootSequence] = useState(false)
  const router = useRouter()

  // Check if boot sequence has been shown before
  useEffect(() => {
    // Only run on client side
    const hasSeenBoot = localStorage.getItem("hasSeenBootSequence")

    if (!hasSeenBoot) {
      setShowBootSequence(true)
      // Set flag in localStorage to indicate boot sequence has been shown
      localStorage.setItem("hasSeenBootSequence", "true")
    }
  }, [])

  // Terminal text content for each stage
  const bootTexts = [
    "INITIALIZING SYSTEM...",
    "LOADING CORE MODULES...",
    "CHECKING MEMORY ALLOCATION...",
    "ESTABLISHING NETWORK CONNECTION...",
    "LOADING USER INTERFACE...",
    "SYSTEM READY.",
  ]

  // Blinking cursor effect
  useEffect(() => {
    if (!showBootSequence) return

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [showBootSequence])

  // Boot sequence progression
  useEffect(() => {
    if (!showBootSequence) return

    const bootSequence = async () => {
      // Stage 0: Initial delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setBootStage(1)

      // Stage 1: Loading core modules with progress bar
      const loadingInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(loadingInterval)
            return 100
          }
          return prev + 1
        })
      }, 30)

      // Stage 2-4: System checks
      await new Promise((resolve) => setTimeout(resolve, 3500))
      setBootStage(2)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setBootStage(3)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setBootStage(4)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setBootStage(5)

      // Final stage: Complete and fade out
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setShowBootSequence(false)
    }

    bootSequence()
  }, [showBootSequence])

  if (!showBootSequence) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-xs p-4 font-mono text-green-500 border-2 border-green-500 rounded-lg sm:max-w-md md:max-w-lg lg:max-w-2xl sm:p-6 md:p-8 bg-black/90">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="text-xs sm:text-sm">RETRO-OS v1.0</div>
          <div className="text-xs sm:text-sm">{new Date().toLocaleString()}</div>
        </div>

        <div className="h-[50vh] sm:h-[60vh] overflow-hidden flex flex-col">
          <div className="flex-1 space-y-2 overflow-y-auto terminal-text">
            {bootStage >= 0 && (
              <div className="flex items-start">
                <span className="mr-1 text-green-300 sm:mr-2">$&gt;</span>
                <div>
                  <RetroGlitch>
                    <span className="text-sm sm:text-base">{bootTexts[0]}</span>
                  </RetroGlitch>
                  <span className="ml-1">{showCursor ? "█" : " "}</span>
                </div>
              </div>
            )}

            {bootStage >= 1 && (
              <div className="mt-3 sm:mt-4">
                <div className="flex items-start">
                  <span className="mr-1 text-green-300 sm:mr-2">$&gt;</span>
                  <span className="text-sm sm:text-base">{bootTexts[1]}</span>
                </div>
                <div className="w-full h-4 mt-1 overflow-hidden border border-green-500 rounded sm:h-6 sm:mt-2">
                  <div
                    className="h-full bg-green-500/30"
                    style={{ width: `${loadingProgress}%`, transition: "width 100ms linear" }}
                  ></div>
                </div>
                <div className="mt-1 text-right text-xs">{loadingProgress}%</div>
              </div>
            )}

            {bootStage >= 2 && (
              <div className="mt-3 sm:mt-4">
                <div className="flex items-start">
                  <span className="mr-1 text-green-300 sm:mr-2">$&gt;</span>
                  <span className="text-sm sm:text-base">{bootTexts[2]}</span>
                </div>
                <div className="mt-1 ml-4 sm:ml-6">
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">MEMORY CHECK:</span> OK
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">AVAILABLE RAM:</span> 640K (OUGHT TO BE ENOUGH FOR ANYBODY)
                  </div>
                </div>
              </div>
            )}

            {bootStage >= 3 && (
              <div className="mt-3 sm:mt-4">
                <div className="flex items-start">
                  <span className="mr-1 text-green-300 sm:mr-2">$&gt;</span>
                  <span className="text-sm sm:text-base">{bootTexts[3]}</span>
                </div>
                <div className="mt-1 ml-4 sm:ml-6">
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">NETWORK STATUS:</span> CONNECTED
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">PROTOCOL:</span> HTTP/3
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">PING:</span> 42ms
                  </div>
                </div>
              </div>
            )}

            {bootStage >= 4 && (
              <div className="mt-3 sm:mt-4">
                <div className="flex items-start">
                  <span className="mr-1 text-green-300 sm:mr-2">$&gt;</span>
                  <span className="text-sm sm:text-base">{bootTexts[4]}</span>
                </div>
                <div className="mt-1 ml-4 sm:ml-6">
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">LOADING COMPONENTS:</span> COMPLETE
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">RENDERING ENGINE:</span> READY
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="text-yellow-400">DISPLAY MODE:</span> VGA 640x480
                  </div>
                </div>
              </div>
            )}

            {bootStage >= 5 && (
              <div className="mt-3 sm:mt-4">
                <div className="flex items-start">
                  <span className="mr-1 text-green-300 sm:mr-2">$&gt;</span>
                  <span className="text-lg font-bold text-green-400 sm:text-xl">{bootTexts[5]}</span>
                  <span className="ml-1">{showCursor ? "█" : " "}</span>
                </div>
                <div className="mt-1 ml-4 text-xs sm:text-sm sm:ml-6 sm:mt-2">
                  <span className="text-yellow-400">LAUNCHING PORTFOLIO...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-3 text-xs sm:mt-4 sm:text-sm">
          <div>PRESS ANY KEY TO SKIP</div>
          <div className="animate-pulse">SYSTEM LOADING...</div>
        </div>
      </div>

      {/* Skip button - invisible but covers the whole screen */}
      <button
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={() => {
          setShowBootSequence(false)
          // Even if skipped, we still want to remember that it was shown
          localStorage.setItem("hasSeenBootSequence", "true")
        }}
        aria-label="Skip boot animation"
      />
    </div>
  )
}
