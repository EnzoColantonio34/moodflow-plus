import type React from "react"
import type { Metadata } from "next"
import { Ubuntu, Ubuntu_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingMusicPlayer } from "@/components/floating-music-player"

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu",
})

const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-ubuntu-mono",
})

export const metadata: Metadata = {
  title: "MoodFlow+ - Suivi d'humeur intelligent",
  description: "Application de suivi d'humeur avec analyse météo",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${ubuntu.variable} ${ubuntuMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <FloatingMusicPlayer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
