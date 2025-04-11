"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

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
import { toast } from "sonner"
import api from "@/app/utils/axiosInstance"

interface CreateChapterModalProps {
  courseId: string
  isOpen: boolean
  onClose: () => void
}

export function CreateChapterModal({ courseId, isOpen, onClose }: CreateChapterModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order:1
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await api.post("chapter/create-chapters", {
        title: formData.title,
        description: formData.description,
        order: formData.order,
        courseId: courseId
      });

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        toast.success("Course created", {
          description: `"${formData.title}" has been created successfully.`,
        });

        // Reset form and close modal
        setFormData({ title: "", description: "",order:1 });
        onClose();
        
        // Refresh the page to show new course
        router.refresh();
      } else {
        throw new Error(response.data?.message || "Failed to create course");
      }
    } catch (error) {
      toast.error("Error creating course", {
        description: "Failed to create course. Please try again.",
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
            <DialogTitle>Add New Chapter</DialogTitle>
            <DialogDescription>
              Create a new chapter for your course. You can add lessons to this chapter later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Chapter Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Introduction to HTML"
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
                placeholder="Provide a brief description of this chapter"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order">order</Label>
              <Textarea
                id="order"
                name="description"
                placeholder="Enter the chapter number"
                value={formData.order}
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
                "Create Chapter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
