"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, User, Code, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RetroGlitch } from "@/components/retro-glitch";
import { useTransition } from "@/components/page-transition";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { isTransitioning } = useTransition();

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#050510]/95" : "bg-[#050510]/80"
      } backdrop-blur-md border-b border-cyan-500/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]`}
    >
      {/* Circuit board line decoration */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 group"
          onClick={closeMenu}
        >
          <div className="relative">
            <RetroGlitch>
              <span className="text-xl font-bold text-cyan-400 font-pixel tracking-tighter group-hover:text-pink-400 transition-colors">
                &lt;DEV/&gt;
              </span>
            </RetroGlitch>
            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-cyan-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex md:items-center md:space-x-8">
          {[
            {
              name: "HOME",
              path: "/",
              color: "hover:text-pink-400",
              activeColor: "text-pink-400",
            },
            {
              name: "ABOUT",
              path: "/about",
              color: "hover:text-yellow-400",
              activeColor: "text-yellow-400",
            },
            {
              name: "PROJECTS",
              path: "/projects",
              color: "hover:text-green-400",
              activeColor: "text-green-400",
            },
            {
              name: "CONTACT",
              path: "/contact",
              color: "hover:text-cyan-400",
              activeColor: "text-cyan-400",
            },
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`relative px-2 py-1 text-sm font-medium font-pixel tracking-widest transition-all duration-200 group ${
                isActive(item.path)
                  ? item.activeColor
                  : "text-gray-400 " + item.color
              } ${isTransitioning ? "pointer-events-none" : ""}`}
            >
              {item.name}

              {/* Hover underline glitch */}
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-current transform ${
                isActive(item.path) ? "scale-x-100" : "scale-x-0"
              } transition-transform group-hover:scale-x-100 duration-300 origin-right group-hover:origin-left`}></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-cyan-400 hover:text-pink-400 hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all duration-300"
          onClick={toggleMenu}
          disabled={isTransitioning}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Side Drawer - Cyberpunk Style */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Background Dim with scanlines */}
          <div
            className="absolute inset-0 bg-[#050510]/90 backdrop-blur-sm transition-opacity duration-300 pattern-grid-lg"
            onClick={closeMenu}
          />

          {/* Drawer */}
          <div
            className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-[#0a0a15] border-l-2 border-cyan-500/50 shadow-[0_0_50px_rgba(0,255,255,0.2)] transform transition-transform duration-300 ease-out ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-center p-6 border-b border-cyan-500/30 bg-black/20">
                <span className="text-xl font-bold text-cyan-400 font-pixel tracking-widest">
                  MENU_SYSTEM
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-400 hover:bg-red-950/30"
                  onClick={closeMenu}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Links */}
              <nav className="flex flex-col p-8 space-y-8">
                {[
                  {
                    name: "HOME",
                    path: "/",
                    icon: Home,
                    color: "text-pink-400",
                  },
                  {
                    name: "ABOUT",
                    path: "/about",
                    icon: User,
                    color: "text-yellow-400",
                  },
                  {
                    name: "PROJECTS",
                    path: "/projects",
                    icon: Code,
                    color: "text-green-400",
                  },
                  {
                    name: "CONTACT",
                    path: "/contact",
                    icon: Mail,
                    color: "text-cyan-400",
                  },
                ].map((item, index) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMenu}
                    className={`flex items-center text-xl font-pixel transition-all hover:translate-x-2 duration-300 group ${
                      isActive(item.path)
                        ? item.color
                        : "text-gray-400 hover:text-white"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={`p-2 mr-4 rounded-md bg-white/5 border border-white/10 group-hover:border-${item.color.split("-")[1]}-500/50 transition-colors`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${isActive(item.path) ? item.color : "text-gray-400 group-hover:text-white"}`}
                      />
                    </div>
                    {isActive(item.path) && (
                      <span className="mr-2 animate-pulse">&gt;</span>
                    )}
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto p-6 border-t border-cyan-500/30 bg-black/20">
                <div className="text-xs text-center font-vt323 text-cyan-500/70 uppercase tracking-widest">
                  System Status: ONLINE
                  <br />
                  v.2.0.24
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
