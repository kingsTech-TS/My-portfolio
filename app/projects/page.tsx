"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import RetroHeading from "@/components/retro-heading"
import { ScanLines } from "@/components/scan-lines"
import { NeonText } from "@/components/neon-text"
import ProjectCard from "@/components/project-card"
import { RetroGlitch } from "@/components/retro-glitch"
import DigitalRain from "@/components/digital-rain"
import RainToggle from "@/components/rain-toggle"

export default function ProjectsPage() {
  const [showRain, setShowRain] = useState(true)

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
      <ScanLines />

      {showRain && <DigitalRain color="#00ff9b" speed={0.8} density={1.2} opacity={0.1} />}
      <RainToggle onToggle={setShowRain} initialState={showRain} />

      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl sm:py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center mb-6 mt-7 text-cyan-300 hover:text-cyan-400 transition-colors sm:mb-8"
        >
          <ArrowLeft className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="text-sm font-pixel sm:text-base">Back to Home</span>
        </Link>

        <RetroHeading>
          <RetroGlitch>
            <NeonText color="green">MY</NeonText>
            <span className="text-white">_PROJECTS</span>
          </RetroGlitch>
        </RetroHeading>

        <p className="max-w-2xl mt-3 mb-8 text-base text-gray-300 font-vt323 sm:text-lg md:text-xl sm:mt-4 sm:mb-10 md:mb-12">
          Check out some of my recent work. Each project represents a unique challenge and solution.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          <ProjectCard
            title="Kenneth Dike Library"
            description="The Kenneth Dike Library website is a clean, modern web platform designed to provide easy access to library information and resources and visitors to explore library services, resources."
            image="/Projects/home.PNG"
            tags={["Next.js", "ShadCN", "TailwindCSS", "Framer Motion", "TypeScript", "Firebase", "MongoDB"]}
            demoUrl="https://kenneth-dike-library-iota.vercel.app/"
            codeUrl="https://github.com/kingsTech-TS/Kenneth-Dike-Library-"
            color="cyan"
          />

          <ProjectCard
            title="Birthday website"
            description="A fun and interactive birthday-themed website featuring animations and personalized messages."
            image="/Projects/birthday.PNG"
            tags={["Next.js", "Canvas", "TailwindCSS", "Framer Motion", "TypeScript"]}
            demoUrl="https://mybirthday-swd6.vercel.app/"
            codeUrl="https://github.com/theKingSi/my-birthday-web21"
            color="pink"
          />
          <ProjectCard
            title="CGPA Calculator"
            description="A simple and intuitive web app to calculate CGPA based on course grades and credit units."
            image="/Projects/CGPA.PNG"
            tags={["HTML", "CSS", "javaScript"]}
            demoUrl="https://thekingsi.github.io/CGPA-Calculator/"
            codeUrl="https://github.com/theKingSi/CGPA-Calculator"
            color="cyan"
          />

          <ProjectCard
            title="Attendance Managment System"
            description="Showing up matters! Attendance reflects interest, reliability, and active participation, making every moment count in shared events and experiences."
            image="/Projects/attends.PNG"
            tags={["Next.js", "TailwindCSS", "TypeScript", "ShandCN"]}
            demoUrl="https://attendance-ms-tau.vercel.app/"
            codeUrl="https://github.com/theKingSi/attendance-ms"
            color="purple"
          />

          <ProjectCard
            title="Church Website"
            description="A Christian church and online ministry platform, with a dashboard that allows user to update and delete contents in the website."
            image="/Projects/church.PNG"
            tags={["Next.js", "Tailwind", "TypeScript", "ShandCN"]}
            demoUrl="https://cccogo.vercel.app/"
            codeUrl="https://github.com/kingsTech-TS/CCCOGO"
            color="orange"
          />

          <ProjectCard
            title="Med Track"
            description="A dashboard interface where authorized users can sign in to manage medicine inventory and view insights, with Real-time tracking of stock levels, Monitoring of expiration dates Role-based multi-user access and permissions, Analytics & reporting tools, Alerts for low stock or impending expiry, Secure, HIPAA-compliant handling of medical dat."
            image="/Projects/med.PNG"
            tags={["Next.js", "Tailwind", "TypeScript", "ShandCN"]}
            demoUrl="https://medicine-inventory-management-syste-tau.vercel.app/dashboard"
            codeUrl="https://github.com/kingsTech-TS/Medicine-Inventory-Management-System"
            color="green"
          />

          <ProjectCard
            title="Fun-Learn"
            description="FunLearn is a web app that lets you upload any book (PDF, EPUB, text) and instantly transform it into a full learning experience. It generates, Smart summaries capturing key ideas Quizzes to test understanding, Interactive games (flashcards, matching, puzzles), Audio versions so you can listen on the go."
            image="/Projects/fun.PNG"
            tags={["Next.js", "Tailwind", "TypeScript", "ShandCN"]}
            demoUrl="https://fun-learn-gamma.vercel.app/"
            codeUrl="https://github.com/kingsTech-TS/fun-learn"
            color="black"
          />

          <ProjectCard
            title=" Cosmic Explorer"
            description="A space-themed exploration app with interactive 3D models and educational content about the universeis with stunning images from NASA’s Astronomy Picture of the Day. The site features a clean interface with navigation to sections like Home, APOD, and Gallery, and invites visitors to discover daily high-definition photos."
            image="/Projects/cosmic.PNG"
            tags={["Next.js", "TailwindCSS", "TypeScript", "ShandCN", "NASA API"]}
            demoUrl="https://cosmic-e.vercel.app/"
            codeUrl="https://github.com/kingsTech-TS/Cosmic-E"
            color="purple"
          />

          <ProjectCard
            title="Techhub Website"
            description="The official online presence of a growing technology community at Ekiti State University focused on empowering students and young innovators. The site showcases the Hub’s mission to help learners build in-demand tech skills across areas like web and mobile development, cloud computing, AI/machine learning, cybersecurity, UI/UX design, and more."
            image="/Projects/tech.PNG"
            tags={["Next.js", "Tailwind", "TypeScript", "ShandCN"]}
            demoUrl="https://www.techhubeksu.com/"
            codeUrl="https://github.com/AKDebug-UX/TechHub-EKSU-Site"
            color="orange"
          />
        </div>
      </div>
    </main>
  )
}

