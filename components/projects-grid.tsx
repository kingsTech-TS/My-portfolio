"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github } from "lucide-react"
import { Card, ProjectStackCard } from "@/components/bento"
import type { Category, Project } from "@/lib/data"
import { cn } from "@/components/lib/utils"

const CATEGORIES: Category[] = ["All", "Web App", "Website", "Tools"]

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Category>("All")
  const filtered = projects.filter((p) => filter === "All" || p.category === filter)

  return (
    <div className="flex flex-col gap-5">
      <Card glow="tr" className="px-7 py-10 sm:px-12 sm:py-14">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">Portfolio</p>
        <h1 className="mt-6 text-gradient text-4xl font-semibold tracking-tighter sm:text-5xl">Selected projects</h1>
        <p className="mt-3 max-w-lg text-base text-neutral-300 sm:text-lg">
          Recent work. Each project represents a unique challenge and solution.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                filter === cat
                  ? "border-brand bg-brand text-white"
                  : "border-line bg-ink/60 text-neutral-300 hover:border-neutral-500 hover:text-white",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 && (
        <Card className="px-7 py-12 text-center text-neutral-400">
          {projects.length === 0 ? "Projects are on their way. Check back soon." : "No projects in this category yet."}
        </Card>
      )}

      <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id ?? project.title}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex"
            >
              <ProjectStackCard project={project} className="w-full">
                <p className="mt-10 text-base leading-relaxed text-neutral-300">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line bg-ink/60 px-3 py-1 text-xs text-neutral-300">
                      {t}
                    </span>
                  ))}
                </div>
                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit items-center gap-2 text-sm text-neutral-300 hover:text-brand"
                  >
                    <Github className="h-4 w-4" /> View source
                  </a>
                )}
              </ProjectStackCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
