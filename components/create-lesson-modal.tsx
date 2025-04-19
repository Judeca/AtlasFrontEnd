"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner" // ✅ Import Sonner toast

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
import { Textarea } from "@/components/ui/textarea"
import api from "@/app/utils/axiosInstance"

interface CreateLessonModalProps {
  courseId: string
  chapterId: string
  isOpen: boolean 
  onClose: () => void
  onSuccess:() => void
}

export function CreateLessonModal({ courseId, chapterId, isOpen,onSuccess, onClose }: CreateLessonModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    duration: "",

  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await api.post("/lesson/create-lessons", {
        title: formData.title,
        content: formData.content,
        duration:formData.duration,
        chapterId: chapterId
      });

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        toast.success("Lesson created", {
          description: `"${formData.title}" has been created successfully.`,
        });

        // Reset form and close modal
        setFormData({ title: "", content: "", duration: "" })
        onSuccess()
        onClose();
        
        // Refresh the page to show new course
        router.refresh();
      } else {
        throw new Error(response.data?.message || "Failed to create lesson");
      }
    } catch (error) {
      toast.error("Error creating lesson", {
        description: "Failed to create lesson. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Lesson</DialogTitle>
            <DialogDescription>
              Create a new lesson for this chapter. You can add materials to this lesson later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Introduction to HTML Tags"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Provide the content for this lesson"
                value={formData.content}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="e.g., 15"
                value={formData.duration}
                onChange={handleChange}
                required
              />
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
                "Create Lesson"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
