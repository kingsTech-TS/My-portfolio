"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, User, Code, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import RetroHeading from "@/components/retro-heading"
import PixelAvatar from "@/components/pixel-avatar"
import { RetroGlitch } from "@/components/retro-glitch"
import { ScanLines } from "@/components/scan-lines"
import { NeonText } from "@/components/neon-text"
import BootSequence from "@/components/boot-sequence"
import DigitalRain from "@/components/digital-rain"
import RainToggle from "@/components/rain-toggle"
import Image from "next/image"

export default function Home() {
  const [showRain, setShowRain] = useState(true)

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
      <BootSequence />
      <ScanLines />
      {showRain && <DigitalRain color="#00ff9b" speed={0.8} density={1.2} opacity={0.1} />}
      <RainToggle onToggle={setShowRain} initialState={showRain} />

      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl sm:py-12 md:py-16">
        <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="inline-block">
              <RetroGlitch>
                <span className="text-base font-bold text-green-400 font-pixel sm:text-lg">NNABUGWU SOLOMON</span>
              </RetroGlitch>
            </div>

            <RetroHeading>
              <NeonText color="pink">KING&rsquo;s</NeonText>
              <span className="text-white">TECH</span>
              <span className="text-yellow-400">_</span>
            </RetroHeading>

            <p className="text-lg text-cyan-300 font-vt323 sm:text-xl">
              I create <span className="text-yellow-400">pixel-perfect</span> web experiences with{" "}
              <span className="text-green-400">modern</span> technologies.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2 sm:justify-start sm:gap-4 sm:pt-4">
  <Link href="/projects" className="relative z-20">
    <Button variant="retro" className="relative z-20 text-sm sm:text-base">
      <span>View Projects</span>
      <Code className="w-4 h-4 ml-2" />
    </Button>
  </Link>

  <Link href="/contact" className="relative z-20">
    <Button variant="retroPink" className="relative z-20 text-sm sm:text-base">
      <span>Contact Me</span>
      <Mail className="w-4 h-4 ml-2" />
    </Button>
  </Link>
</div>

          </div>


          <div className="flex items-center justify-center mt-4 md:mt-0">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur-xl opacity-50 animate-pulse"></div>
              <div className="relative p-1 overflow-hidden border-4 border-cyan-400 rounded-lg shadow-lg bg-indigo-950">
               <PixelAvatar />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-16 sm:gap-6 sm:mt-20 md:grid-cols-3 md:mt-24">
          {/* About Me Card */}
          <Link href="/about" className="group h-full">
            <div className="flex flex-col justify-between h-full p-4 transition-all border-2 border-yellow-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50 hover:bg-indigo-900/70 hover:shadow-yellow-500/20">
              <div>
                <div className="flex items-center mb-3 space-x-2 sm:mb-4">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                  <h2 className="text-lg font-bold text-yellow-400 font-pixel sm:text-xl">About Me</h2>
                </div>
                <p className="text-sm text-gray-300 font-vt323 sm:text-base">
                  Learn about my journey, skills, and experience in the digital realm.
                </p>
              </div>
              <div className="flex items-center mt-3 text-yellow-400 group-hover:translate-x-2 transition-transform sm:mt-4">
                <span className="text-xs font-bold sm:text-sm">Explore</span>
                <ChevronRight className="w-3 h-3 ml-1 sm:w-4 sm:h-4" />
              </div>
            </div>
          </Link>

          {/* Projects Card */}
          <Link href="/projects" className="group h-full">
            <div className="flex flex-col justify-between h-full p-4 transition-all border-2 border-green-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50 hover:bg-indigo-900/70 hover:shadow-green-500/20">
              <div>
                <div className="flex items-center mb-3 space-x-2 sm:mb-4">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                  <h2 className="text-lg font-bold text-green-400 font-pixel sm:text-xl">Projects</h2>
                </div>
                <p className="text-sm text-gray-300 font-vt323 sm:text-base">
                  Check out my latest work and the technologies I've mastered.
                </p>
              </div>
              <div className="flex items-center mt-3 text-green-400 group-hover:translate-x-2 transition-transform sm:mt-4">
                <span className="text-xs font-bold sm:text-sm">Discover</span>
                <ChevronRight className="w-3 h-3 ml-1 sm:w-4 sm:h-4" />
              </div>
            </div>
          </Link>

          {/* Contact Card */}
          <Link href="/contact" className="group h-full">
            <div className="flex flex-col justify-between h-full p-4 transition-all border-2 border-pink-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50 hover:bg-indigo-900/70 hover:shadow-pink-500/20">
              <div>
                <div className="flex items-center mb-3 space-x-2 sm:mb-4">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  <h2 className="text-lg font-bold text-pink-400 font-pixel sm:text-xl">Contact</h2>
                </div>
                <p className="text-sm text-gray-300 font-vt323 sm:text-base">
                  Get in touch for collaborations, opportunities, or just to say hello.
                </p>
              </div>
              <div className="flex items-center mt-3 text-pink-400 group-hover:translate-x-2 transition-transform sm:mt-4">
                <span className="text-xs font-bold sm:text-sm">Connect</span>
                <ChevronRight className="w-3 h-3 ml-1 sm:w-4 sm:h-4" />
              </div>
            </div>
          </Link>
        </div>

      </div>
    </main>
  )
}
