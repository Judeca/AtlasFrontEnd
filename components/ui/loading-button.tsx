
"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ComponentProps, forwardRef } from "react"

interface LoadingButtonProps extends ComponentProps<typeof Button> {
  isLoading?: boolean
  loadingText?: string
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ isLoading = false, loadingText = "", children, ...props }, ref) => {
    return (
      <Button ref={ref} disabled={isLoading} {...props}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"