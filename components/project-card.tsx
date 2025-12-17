"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl: string
  codeUrl: string
  color: "pink" | "cyan" | "yellow" | "green" | "purple" | "orange" | "violet" | "black"
}

export default function ProjectCard({ title, description, image, tags, demoUrl, codeUrl, color }: ProjectCardProps) {
  const [isHovering, setIsHovering] = useState(false)

  const colorClasses = {
    pink: {
      border: "border-pink-500",
      text: "text-pink-400",
      hover: "group-hover:bg-pink-950/50",
      button: "border-pink-500 bg-transparent text-pink-400 hover:bg-pink-950/50 hover:text-pink-300",
    },
    cyan: {
      border: "border-cyan-500",
      text: "text-cyan-400",
      hover: "group-hover:bg-cyan-950/50",
      button: "border-cyan-500 bg-transparent text-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-300",
    },
    yellow: {
      border: "border-yellow-500",
      text: "text-yellow-400",
      hover: "group-hover:bg-yellow-950/50",
      button: "border-yellow-500 bg-transparent text-yellow-400 hover:bg-yellow-950/50 hover:text-yellow-300",
    },
    green: {
      border: "border-green-500",
      text: "text-green-400",
      hover: "group-hover:bg-green-950/50",
      button: "border-green-500 bg-transparent text-green-400 hover:bg-green-950/50 hover:text-green-300",
    },
    purple: {
      border: "border-purple-500",
      text: "text-purple-400",
      hover: "group-hover:bg-purple-950/50",
      button: "border-purple-500 bg-transparent text-purple-400 hover:bg-purple-950/50 hover:text-purple-300",
    },
    orange: {
      border: "border-orange-500",
      text: "text-orange-400",
      hover: "group-hover:bg-orange-950/50",
      button: "border-orange-500 bg-transparent text-orange-400 hover:bg-orange-950/50 hover:text-orange-300",
    },
    violet: {
      border: "border-violet-500",
      text: "text-violet-400",
      hover: "group-hover:bg-violet-950/50",
      button:
        "border-violet-500 bg-transparent text-violet-400 hover:bg-violet-950/50 hover:text-violet-300",
    },
    black: {
  border: "border-gray-600",
  text: "text-gray-200",
  hover: "group-hover:bg-black/50",
  button:
    "border-gray-600 bg-transparent text-gray-200 hover:bg-black/50 hover:text-gray-300",
},
  }

  return (
    <div
      className={`group relative overflow-hidden border-2 ${colorClasses[color].border} rounded-lg bg-indigo-950/50 transition-all duration-300 hover:shadow-lg`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden aspect-video">
        <div className="w-full h-full bg-indigo-800/50">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={400}
            height={225}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        </div>
        <div
          className={`absolute inset-0 opacity-0 ${colorClasses[color].hover} transition-opacity duration-300 group-hover:opacity-100`}
        ></div>
      </div>

      <div className="p-4 sm:p-6">
        <h3 className={`mb-2 text-lg font-bold font-pixel ${colorClasses[color].text} sm:text-xl`}>{title}</h3>
        <p className="mb-3 text-sm text-gray-300 font-vt323 sm:text-base sm:mb-4">{description}</p>

        <div className="flex flex-wrap gap-1 mb-4 sm:gap-2 sm:mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-block px-2 py-0.5 text-xs font-medium border ${colorClasses[color].border} rounded-md ${colorClasses[color].text} font-vt323 sm:px-2 sm:py-1`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" className="relative z-20">
            <Button className={`border-2 ${colorClasses[color].button} relative z-20 text-xs sm:text-sm`}>
              <span className="mr-1 sm:mr-2">Demo</span>
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </a>

          <a href={codeUrl} target="_blank" rel="noopener noreferrer" className="relative z-20">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white relative z-20 text-xs sm:text-sm"
            >
              <span className="mr-1 sm:mr-2">Code</span>
              <Github className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </a>
        </div>
      </div>

      {isHovering && (
        <div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent animate-pulse"
          style={{ color: `var(--${color}-500)` }}
        ></div>
      )}
    </div>
  )
}
