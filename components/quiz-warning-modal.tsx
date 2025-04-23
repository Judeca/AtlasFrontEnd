"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function QuizWarningModal({
  isOpen,
  onClose,
  onStartQuiz,
}: {
  isOpen: boolean
  onClose: () => void
  onStartQuiz: () => void 
}) {
  const [isStarting, setIsStarting] = useState(false)

  const handleStartQuiz = () => {
    setIsStarting(true)
    
    setTimeout(() => {
      onStartQuiz()
      setIsStarting(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={isStarting ? undefined : onClose}>
      <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
  <DialogTitle className="text-center">Quiz Instructions</DialogTitle>
  <div className="text-sm text-muted-foreground pt-2">
    <p className="mb-3 font-medium">You are about to take a quiz. Please note:</p>
    <ul className="list-disc pl-5 space-y-2">
      <li>Make sure your quiz is submitted before leaving</li>
      <li>Do not leave the page until completion</li>
      <li>Closing prematurely may cause errors and quiz failure</li>
      <li className="font-semibold text-yellow-600">Failing questions leads to points deduction</li>
      <li className="font-semibold text-red-600">You may end up with a negative score if you fail too much</li>
      
      <li className="mt-4 font-medium">Scoring System:</li>
      
      {/* Easy Questions */}
      <li className="flex items-start gap-1">
        <span className="font-medium text-green-600">Easy Questions:</span>
        <div className="ml-1">
          <span className="text-green-500">Correct: +1</span>
          <span className="mx-1">/</span>
          <span className="text-red-500">Wrong: -1</span>
        </div>
      </li>
      
      {/* Intermediate Questions */}
      <li className="flex items-start gap-1">
        <span className="font-medium text-blue-600">Intermediate Questions:</span>
        <div className="ml-1">
          <span className="text-blue-500">Correct: +2</span>
          <span className="mx-1">/</span>
          <span className="text-red-500">Wrong: -2</span>
        </div>
      </li>
      
      {/* Advanced Questions */}
      <li className="flex items-start gap-1">
        <span className="font-medium text-purple-600">Advanced Questions:</span>
        <div className="ml-1">
          <span className="text-purple-500">Correct: +3</span>
          <span className="mx-1">/</span>
          <span className="text-red-500">Wrong: -3</span>
        </div>
      </li>
    </ul>
  </div>
</DialogHeader>
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="destructive" onClick={onClose} disabled={isStarting}>
            Cancel
          </Button>
          <Button onClick={handleStartQuiz} disabled={isStarting}>
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              "Start Quiz"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}