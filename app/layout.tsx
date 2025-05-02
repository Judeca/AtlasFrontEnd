import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { SocketProvider } from "./context/SocketContext"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Atlas Learn",
  description: "A modern learning platform for teachers and students",
  icons: {
    icon: "/letter-a-alphabet-a-sticker.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <SocketProvider>
          {children}
          <Toaster />
          </SocketProvider>
       
      </body>
    </html>
  )
}

