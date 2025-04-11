import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Learning Platform",
  description: "A modern learning platform for teachers and students",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
          {children}
          <Toaster />
       
      </body>
    </html>
  )
}

