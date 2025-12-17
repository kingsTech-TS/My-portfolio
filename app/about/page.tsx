"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Award, Briefcase, Laptop, School2 } from "lucide-react"
import RetroHeading from "@/components/retro-heading"
import { ScanLines } from "@/components/scan-lines"
import { NeonText } from "@/components/neon-text"
import { TimelineItem } from "@/components/timeline-item"
import { SkillBadge } from "@/components/skill-badge"
import { RetroGlitch } from "@/components/retro-glitch"
import DigitalRain from "@/components/digital-rain"
import RainToggle from "@/components/rain-toggle"
 


export default function AboutPage() {
  const [showRain, setShowRain] = useState(true)



  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900">
      <ScanLines />

        {showRain && <DigitalRain color="#00ff9b" speed={0.8} density={1.2} opacity={0.1} />}
            <RainToggle onToggle={setShowRain} initialState={showRain} />

      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl sm:py-12 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center mb-6 mt-7 text-cyan-300 hover:text-cyan-400 transition-colors sm:mb-8 "
        >
          <ArrowLeft className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="text-sm font-pixel sm:text-base">Back to Home</span>
        </Link>

        <RetroHeading>
          <RetroGlitch>
            <NeonText color="yellow">ABOUT</NeonText>
            <span className="text-white">_ME</span>
          </RetroGlitch>
        </RetroHeading>

        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-3 sm:mt-10 md:mt-12 sm:gap-10 md:gap-12">
          <div className="lg:col-span-2">
            <div className="p-4 border-2 border-cyan-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50">
              <h2 className="mb-4 text-xl font-bold text-cyan-400 font-pixel sm:text-2xl sm:mb-6">My Story</h2>
              <div className="space-y-3 text-sm text-gray-300 font-vt323 sm:text-base sm:space-y-4">
                <p>
                  I&rsquo;m a passionate Software developer with a love for creating immersive digital experiences. My journey
                  began in the early days of the web, and I&rsquo;ve evolved alongside the technologies that power our digital
                  world.
                </p>
                <p>
                  With a background in both design and development, I bring a unique perspective to every project. I
                  believe in the perfect balance between form and function, creating websites and web applications that not only look amazing
                  but perform flawlessly.
                </p>
                <p>
                When I&rsquo;m not coding, you&rsquo;ll find me capturing moments through photography, crafting engaging content, or exploring visual storytelling to connect ideas and creativity in new ways.

                </p>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 md:mt-12">
              <h2 className="mb-4 text-xl font-bold text-pink-400 font-pixel sm:text-2xl sm:mb-6">My Journey</h2>
              <div className="space-y-6 sm:space-y-8">
                 <TimelineItem
                  icon={<Briefcase className="w-5 h-5" />}
                  date="2024 - Present"
                  title="Senior Frontend Developer"
                  company="JeoLinks INC."
                  description="Leading the frontend team in developing modern Software applications using React.js, Next.js, JavaScript and TypeScript."
                  color="pink"
                />

                <TimelineItem
                  icon={<Award className="w-5 h-5" />}
                  date="2023 - 2024"
                  title="JavaScript Certified/Software Developer"
                  company="Techub EKSU"
                  description="Earned certification in JavaScript, enhancing frontend development skills and building dynamic, interactive web applications."
                  color="cyan"
                />

                <TimelineItem
                  icon={<Laptop className="w-5 h-5" />}
                  date="2022 - 2023"
                  title="Web Designer"
                  company="D'Lence Technoligies"
                  description="Worked on designing user-friendly and visually engaging websites, focusing on layout, responsiveness, and user experience."
                  color="yellow"
                />

                <TimelineItem
                  icon={<School2 className="w-5 h-5" />}
                  date="2021"
                  title="Web Designer in Training"
                  company="D'Lence Technoligies"
                  description="Began the journey into web design by learning HTML, CSS, and design principles through online resources and practice projects."
                  color="green"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-4 border-2 border-yellow-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50">
              <h2 className="mb-4 text-xl font-bold text-yellow-400 font-pixel sm:text-2xl sm:mb-6">Skills</h2>

              <div className="mb-4 sm:mb-6">
                <h3 className="mb-2 text-base font-bold text-white font-pixel sm:text-lg sm:mb-3">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                 <SkillBadge name="React" color="cyan" />
                  <SkillBadge name="Next.js" color="white" />
                  <SkillBadge name="TypeScript" color="blue" />
                  <SkillBadge name="Tailwind CSS" color="silver" />
                  <SkillBadge name="JavaScript" color="yellow" />
                  <SkillBadge name="HTML5" color="orange" />
                  <SkillBadge name="CSS3" color="indigo" />
                  <SkillBadge name="Bootstrap" color="green" />
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="mb-2 text-base font-bold text-white font-pixel sm:text-lg sm:mb-3">Backend</h3>
                <div className="flex flex-wrap gap-2">
                 <SkillBadge name="mySQL" color="rose" />
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="mb-2 text-base font-bold text-white font-pixel sm:text-lg sm:mb-3">Tools</h3>
                <div className="flex flex-wrap gap-2">
                     <SkillBadge name="Git" color="orange" />
                  <SkillBadge name="Figma" color="purple" />
                  <SkillBadge name="VS Code" color="blue" />
                  <SkillBadge name="Docker" color="yellow" />
                  <SkillBadge name="sublime Text" color="green" />
                  <SkillBadge name="Postman" color="rose" />
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-green-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50">
              <h2 className="mb-4 text-xl font-bold text-green-400 font-pixel sm:text-2xl sm:mb-6">Interests</h2>
              <ul className="space-y-1 text-sm text-gray-300 font-vt323 sm:text-base sm:space-y-2">
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-green-400"></span>
                  Retro Gaming
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-green-400"></span>
                  Content Creation
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-green-400"></span>
                   Photography
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-green-400"></span>
                 Video Editing
                </li>
                <li className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-2 bg-green-400"></span>
                  UI/UX Design
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
