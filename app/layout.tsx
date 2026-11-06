import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import SiteFooter from "@/components/site-footer"
import SiteChrome from "@/components/site-chrome"
import { ToastProvider } from "@/components/ui/use-toast"
import Toasts from "@/components/ui/toasts"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Nnabugwu Solomon | Frontend Developer",
  description: "Portfolio of Nnabugwu Solomon, a frontend developer building modern web experiences.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <ToastProvider>
          <SiteChrome header={<Navigation />} footer={<SiteFooter />}>
            {children}
          </SiteChrome>
          <Toasts />
        </ToastProvider>
      </body>
    </html>
  )
}
