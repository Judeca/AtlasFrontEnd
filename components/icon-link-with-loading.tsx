
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoadingButton } from "./ui/loading-button"
import { Loader2 } from "lucide-react"

interface IconLinkWithLoadingProps {
  href: string
  icon: React.ReactNode
  srText: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function IconLinkWithLoading({
  href,
  icon,
  srText,
  variant = "ghost",
  size = "icon"
}: IconLinkWithLoadingProps) {
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
        variant={variant}
        size={size}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {icon}
            {/*<span className="sr-only">{srText}</span>*/}
          </>
        )}
      </LoadingButton>
    </Link>
  )
}