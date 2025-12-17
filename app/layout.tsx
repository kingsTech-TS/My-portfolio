import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/navigation"
import { PageTransitionProvider } from "@/components/page-transition"

// 👇 import your custom toast system
import { ToastProvider } from "@/components/ui/use-toast"
import Toasts from "@/components/ui/toasts"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Retro Portfolio | Web Developer",
  description: "A retro-themed portfolio showcasing web development projects and skills",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PageTransitionProvider>
            <ToastProvider>
              <Navigation />
              {children}
              <Toasts /> {/* 👈 Renders all active toasts */}
            </ToastProvider>
          </PageTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
