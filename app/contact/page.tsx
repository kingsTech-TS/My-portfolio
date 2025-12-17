"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Github, Linkedin, Twitter, Mail, MessageSquareMore } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import RetroHeading from "@/components/retro-heading"
import { ScanLines } from "@/components/scan-lines"
import { NeonText } from "@/components/neon-text"
import { RetroGlitch } from "@/components/retro-glitch"
import DigitalRain from "@/components/digital-rain"
import RainToggle from "@/components/rain-toggle"
import { useToast } from "@/components/ui/use-toast"

export default function ContactPage() {

  const [showRain, setShowRain] = useState(true)
  const { toast } = useToast()


  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleDownload = () => {
    // Trigger toast
    toast({
      title: "Download Started",
      description: "Your CV is downloading...",
      variant: "default",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        message: "",
      })
    }, 1500)
  }

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
            <NeonText color="pink">GET</NeonText>
            <span className="text-white">_IN_TOUCH</span>
          </RetroGlitch>
        </RetroHeading>

        <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2 sm:mt-10 md:mt-12 sm:gap-10 md:gap-12">
          <div>
            <div className="p-4 border-2 border-pink-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50">
              <h2 className="mb-4 text-xl font-bold text-pink-400 font-pixel sm:text-2xl sm:mb-6">Contact Me</h2>

              {isSubmitted ? (
                <div className="p-6 text-center">
                  <RetroGlitch>
                    <h3 className="mb-4 text-xl font-bold text-green-400 font-pixel">Message Sent!</h3>
                  </RetroGlitch>
                  <p className="mb-6 text-gray-300 font-vt323">
                    Thanks for reaching out! I'll get back to you as soon as possible.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="retroGreen" className="relative z-20">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-1 text-xs font-bold text-gray-300 font-pixel sm:text-sm sm:mb-2"
                    >
                      NAME_
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="border-2 border-pink-500/50 bg-indigo-950/50 text-white font-vt323 text-sm sm:text-base"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-1 text-xs font-bold text-gray-300 font-pixel sm:text-sm sm:mb-2"
                    >
                      EMAIL_
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="border-2 border-pink-500/50 bg-indigo-950/50 text-white font-vt323 text-sm sm:text-base"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-1 text-xs font-bold text-gray-300 font-pixel sm:text-sm sm:mb-2"
                    >
                      MESSAGE_
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      className="min-h-[120px] sm:min-h-[150px] border-2 border-pink-500/50 bg-indigo-950/50 text-white font-vt323 text-sm sm:text-base"
                      placeholder="Your message here..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="retroPink"
                    className="w-full relative z-20 text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <span className="mr-2 animate-pulse">Sending...</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-1 sm:mr-2">Send Message</span>
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>

          <div>
            <div className="p-4 border-2 border-cyan-500 rounded-lg shadow-lg sm:p-6 bg-indigo-950/50">
              <h2 className="mb-4 text-xl font-bold text-cyan-400 font-pixel sm:text-2xl sm:mb-6">Connect</h2>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-sm text-gray-300 font-vt323 sm:text-base">
                  Feel free to reach out through the form or connect with me on social media. I'm always open to
                  discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <a
                    href="mailto:ndunewesolomon@gmail.com"
                    className="flex items-center p-2 transition-colors border-2 border-yellow-500 rounded-lg sm:p-3 bg-indigo-950/50 hover:bg-yellow-950/50 group"
                  >
                    <Mail className="w-4 h-4 mr-2 text-yellow-400 sm:w-5 sm:h-5 sm:mr-3" />
                    <span className="text-sm text-gray-300 font-vt323 group-hover:text-yellow-300 sm:text-base">
                      ndunewesolomon@gmail.com
                    </span>
                  </a>

                  <a
                    href="https://github.com/theKingSi?tab=repositories"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 transition-colors border-2 border-green-500 rounded-lg sm:p-3 bg-indigo-950/50 hover:bg-green-950/50 group"
                  >
                    <Github className="w-4 h-4 mr-2 text-green-400 sm:w-5 sm:h-5 sm:mr-3" />
                    <span className="text-sm text-gray-300 font-vt323 group-hover:text-green-300 sm:text-base">
                      github.com/theKingSi
                    </span>
                  </a>

                  <a
                    href="https://wa.link/mzkoo2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 transition-colors border-2 border-blue-500 rounded-lg sm:p-3 bg-indigo-950/50 hover:bg-blue-950/50 group"
                  >
                    <MessageSquareMore className="w-4 h-4 mr-2 text-blue-400 sm:w-5 sm:h-5 sm:mr-3" />
                    <span className="text-sm text-gray-300 font-vt323 group-hover:text-blue-300 sm:text-base">
                      https://wa.link/mzkoo2
                    </span>
                  </a>

                  <a
                    href="https://x.com/oneboilikedat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 transition-colors border-2 border-pink-500 rounded-lg sm:p-3 bg-indigo-950/50 hover:bg-pink-950/50 group"
                  >
                    <Twitter className="w-4 h-4 mr-2 text-pink-400 sm:w-5 sm:h-5 sm:mr-3" />
                    <span className="text-sm text-gray-300 font-vt323 group-hover:text-pink-300 sm:text-base">
                      twitter.com/oneboilikedat
                    </span>
                  </a>

                  <a
                    href="/CV/Nnabugwu_Solomon_CV.docx"
                    download
                    onClick={handleDownload}
                    className="flex items-center justify-center p-2 transition-colors border-2 border-red-500 rounded-lg sm:p-3 bg-indigo-950/50 hover:bg-red-950/50 group"
                  >
                    <span className="text-sm font-vt323 text-gray-300 group-hover:text-red-300 sm:text-base">
                      📄 Download CV
                    </span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 mt-6 border-2 border-purple-500 rounded-lg shadow-lg sm:p-6 sm:mt-8 bg-indigo-950/50">
              <h2 className="mb-4 text-xl font-bold text-purple-400 font-pixel sm:text-2xl sm:mb-6">Office Hours</h2>

              <div className="space-y-2 text-sm text-gray-300 font-vt323 sm:text-base sm:space-y-4">
                <p>
                  <span className="font-bold text-purple-300">Monday - Friday:</span> 9:00 AM - 5:00 PM
                </p>
                <p>
                  <span className="font-bold text-purple-300">Saturday:</span> 9:00 AM - 3:00 PM
                </p>
                <p>
                  <span className="font-bold text-purple-300">Sunday:</span> Closed
                </p>
                <p className="pt-2">
                  Working <span className="font-bold text-purple-300">remotely</span> with clients from around the <span className="font-bold text-purple-300">globe</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
