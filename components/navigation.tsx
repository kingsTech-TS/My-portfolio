"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, User, Code, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RetroGlitch } from "@/components/retro-glitch"
import { useTransition } from "@/components/page-transition"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { isTransitioning } = useTransition()

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const isActive = (path: string) => pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-indigo-950/90" : "bg-indigo-950/80"
      } backdrop-blur-sm border-b border-cyan-500/30`}
    >
      <div className="container flex items-center justify-between h-14 px-4 mx-auto max-w-7xl sm:h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
          <RetroGlitch>
            <span className="text-lg font-bold text-cyan-400 font-pixel sm:text-xl">&lt;DEV/&gt;</span>
          </RetroGlitch>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          <Link
            href="/"
            className={`text-xs font-medium font-pixel sm:text-sm transition-colors ${
              isActive("/") ? "text-pink-400" : "text-gray-300 hover:text-pink-400"
            } ${isTransitioning ? "pointer-events-none" : ""}`}
          >
            HOME
          </Link>
          <Link
            href="/about"
            className={`text-xs font-medium font-pixel sm:text-sm transition-colors ${
              isActive("/about") ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
            } ${isTransitioning ? "pointer-events-none" : ""}`}
          >
            ABOUT
          </Link>
          <Link
            href="/projects"
            className={`text-xs font-medium font-pixel sm:text-sm transition-colors ${
              isActive("/projects") ? "text-green-400" : "text-gray-300 hover:text-green-400"
            } ${isTransitioning ? "pointer-events-none" : ""}`}
          >
            PROJECTS
          </Link>
          <Link
            href="/contact"
            className={`text-xs font-medium font-pixel sm:text-sm transition-colors ${
              isActive("/contact") ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400"
            } ${isTransitioning ? "pointer-events-none" : ""}`}
          >
            CONTACT
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-300 hover:text-white hover:bg-transparent"
          onClick={toggleMenu}
          disabled={isTransitioning}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Side Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Background Dim */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMenu}
          />

          {/* Drawer - now slides from LEFT */}
          <div
            className={`absolute left-0 top-0 h-full w-3/4 max-w-sm bg-indigo-950 shadow-xl transform transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-cyan-500/30">
              <span className="text-lg font-bold text-cyan-400 font-pixel">&lt;DEV/&gt;</span>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-white hover:bg-transparent"
                onClick={closeMenu}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Links */}
            <nav className="flex flex-col p-6 space-y-6 bg-indigo-950">
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center text-lg font-pixel transition-colors ${
                  isActive("/") ? "text-pink-400" : "text-gray-300 hover:text-pink-400"
                }`}
              >
                <Home className="w-5 h-5 mr-2" /> 
                HOME
              </Link>
              <Link
                href="/about"
                onClick={closeMenu}
                className={`flex items-center text-lg font-pixel transition-colors ${
                  isActive("/about") ? "text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                ABOUT
              </Link>
              <Link
                href="/projects"
                onClick={closeMenu}
                className={`flex items-center text-lg font-pixel transition-colors ${
                  isActive("/projects") ? "text-green-400" : "text-gray-300 hover:text-green-400"
                }`}
              >
                <Code className="w-5 h-5 mr-2" />
                PROJECTS
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className={`flex items-center text-lg font-pixel transition-colors ${
                  isActive("/contact") ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400"
                }`}
              >
                <Mail className="w-5 h-5 mr-2" />
                CONTACT
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
