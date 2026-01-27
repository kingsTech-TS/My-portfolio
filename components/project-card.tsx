"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { motion } from "framer-motion"
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
      border: "border-pink-500/50",
      glow: "shadow-pink-500/20",
      text: "text-pink-400",
      badge: "bg-pink-500/10 text-pink-300 border-pink-500/20",
      button: "border-pink-500/50 text-pink-400 hover:bg-pink-500/20",
    },
    cyan: {
      border: "border-cyan-500/50",
      glow: "shadow-cyan-500/20",
      text: "text-cyan-400",
      badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
      button: "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20",
    },
    yellow: {
      border: "border-yellow-500/50",
      glow: "shadow-yellow-500/20",
      text: "text-yellow-400",
      badge: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
      button: "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20",
    },
    green: {
      border: "border-green-500/50",
      glow: "shadow-green-500/20",
      text: "text-green-400",
      badge: "bg-green-500/10 text-green-300 border-green-500/20",
      button: "border-green-500/50 text-green-400 hover:bg-green-500/20",
    },
    purple: {
      border: "border-purple-500/50",
      glow: "shadow-purple-500/20",
      text: "text-purple-400",
      badge: "bg-purple-500/10 text-purple-300 border-purple-500/20",
      button: "border-purple-500/50 text-purple-400 hover:bg-purple-500/20",
    },
    orange: {
      border: "border-orange-500/50",
      glow: "shadow-orange-500/20",
      text: "text-orange-400",
      badge: "bg-orange-500/10 text-orange-300 border-orange-500/20",
      button: "border-orange-500/50 text-orange-400 hover:bg-orange-500/20",
    },
    violet: {
      border: "border-violet-500/50",
      glow: "shadow-violet-500/20",
      text: "text-violet-400",
      badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
      button: "border-violet-500/50 text-violet-400 hover:bg-violet-500/20",
    },
    black: {
      border: "border-gray-500/50",
      glow: "shadow-gray-500/20",
      text: "text-gray-400",
      badge: "bg-gray-500/10 text-gray-300 border-gray-500/20",
      button: "border-gray-500/50 text-gray-400 hover:bg-gray-500/20",
    },
  }

  const theme = colorClasses[color]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative flex flex-col overflow-hidden rounded-xl border-2 ${theme.border} bg-gray-950/80 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:${theme.glow}`}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-900/50">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={600}
          height={338}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/20 to-transparent opacity-60" />
        
        {/* Overlay Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className={`${theme.button} border-2 bg-black/50 font-bold backdrop-blur-sm`}>
              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
            </Button>
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={codeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="border-white/20 bg-black/50 text-white hover:bg-white/10 backdrop-blur-sm">
              <Github className="mr-2 h-4 w-4" /> Code
            </Button>
          </motion.a>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className={`mb-2 font-pixel text-lg font-bold ${theme.text} sm:text-xl md:text-2xl`}>{title}</h3>
        
        <p className="mb-4 line-clamp-3 text-sm text-gray-300 font-vt323 leading-relaxed sm:text-base">
          {description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`rounded-md border px-2 py-1 text-xs font-medium font-vt323 transition-colors ${theme.badge}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Decorative Corner */}
      <div className={`absolute -right-12 -top-12 h-24 w-24 bg-linear-to-br from-${color}-500/20 to-transparent blur-2xl group-hover:from-${color}-500/40 transition-all duration-500`} />
    </motion.div>
  )
}
