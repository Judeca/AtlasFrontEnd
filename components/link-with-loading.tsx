
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoadingButton } from "./ui/loading-button"
import { ChevronRight } from "lucide-react"

interface LinkWithLoadingProps {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
  loadingText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function LinkWithLoading({
  href,
  children,
  icon = <ChevronRight className="ml-2 h-4 w-4" />,
  loadingText = "Loading...",
  variant = "default",
  size = "default"
}: LinkWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    router.push(href)
  }

  return (
    <Link href={href} onClick={handleClick}>
      <LoadingButton 
        isLoading={isLoading} 
        loadingText={loadingText}
        variant={variant}
        size={size}
      >
        {children}
        {!isLoading && icon}
      </LoadingButton>
    </Link>
  )
}