 "use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import api from "@/app/utils/axiosInstance"

interface CreateQuizModalProps {
  courseId?: string
  chapterId?: string
  userId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  isChapterIdProvided: boolean
  isCourseIdProvided: boolean
}

export function CreateQuizModal({
  courseId,
  chapterId,
  userId,
  isOpen,
  onClose,
  onSuccess,
  isChapterIdProvided,
  isCourseIdProvided
}: CreateQuizModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    courseId: courseId || null,
    createdBy: "",
    chapterId: chapterId || null,
    quizcategorie: "",
    status: "DRAFT"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, quizcategorie: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const quizData = {
      title:formData.title,
      description:formData.description,
      duration: formData.duration ? parseInt(formData.duration) * 60 : 0,
      quizcategorie:formData.quizcategorie,
      status:formData.status,
      createdBy:userId,
      ...(isCourseIdProvided && { courseId:courseId }),
      ...(isChapterIdProvided && { chapterId:chapterId })
    }

    try {
      const response = await api.post("/quiz/create-quizzes", quizData)

      if (response.status === 201) {
        toast.success("Quiz created", {
          description: "You can now add questions to your quiz.",
        })

        setFormData({ title: "", description: "", duration:"",courseId:"",createdBy:"",chapterId:"",quizcategorie:"",status:"" })
        onSuccess()
        onClose()
      } else {
        throw new Error("Unexpected response")
      }
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create quiz. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              Set up the basic information for your quiz
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., HTML Fundamentals Quiz"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a brief description of this quiz"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Time Limit (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  placeholder="e.g., 30"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">Leave blank for no time limit</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quizcategorie">Quiz Category</Label>
                <Select onValueChange={handleSelectChange} value={formData.quizcategorie} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIXED">FIXED</SelectItem>
                    <SelectItem value="MIXED">MIXED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Quiz
                </>
              )}
            </Button> 
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}