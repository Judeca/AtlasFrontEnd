"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import api from "@/app/utils/axiosInstance"

interface CreateAssignmentModalProps {
  courseId: string
  chapterId: string
  lessonId?:string
  isLessonIdProvided:boolean
  isOpen: boolean
  onClose: () => void
}

export function CreateAssignmentModal({ courseId, chapterId,lessonId,isLessonIdProvided, isOpen, onClose }: CreateAssignmentModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [userId,setUserId]=useState('')
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxScore: 100,
  })

  useEffect(() => {
    const userID = localStorage.getItem("userId"); 
    console.log("HERE IS ",userID)
    if (userID) {
    console.log(userID)
    setUserId(userID)
    }
    },[userId] );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleSubmit = async (e: React.FormEvent) => {
  
    e.preventDefault();

    setIsLoading(true);

    if(!userId){
      console.log("UserId is not provided")
      return;
    }

    const requestBody: {
      title: string;
      description: string;
      maxScore: number;
      dueDate: string;
      courseId: string;
      chapterId: string;
      createdBy:string;
      lessonId?: string;  
    } = {
      title: formData.title,
      description: formData.description,
      maxScore: formData.maxScore,
      dueDate: formData.dueDate,
      courseId: courseId,
      chapterId: chapterId,
      createdBy:userId
    };
    
    if (isLessonIdProvided) {
      requestBody.lessonId = lessonId;
    }

    try {
      const response = await api.post("/assignment/create-assignments", requestBody);

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        toast.success("Assignment created", {
          description: `"${formData.title}" has been created successfully.`,
        });

        // Reset form and close modal
        setFormData({ title: "", description: "", dueDate: "", maxScore: 100 })
        onClose();
        
        // Refresh the page to show new course
        router.refresh();
      } else {
        throw new Error(response.data?.message || "Failed to create assignment");
      }
    } catch (error) {
      toast.error("Error creating assignment", {
        description: "Failed to create assignment. Please try again.",
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
            <DialogTitle>Add New Assignment</DialogTitle>
            <DialogDescription>Create a new assignment for students to complete in this chapter.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Assignment Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Create a Basic HTML Page"
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
                placeholder="Provide detailed instructions for this assignment"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxScore">maxScore</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  value={formData.maxScore}
                  onChange={handleChange}
                  required
                />
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
                  <FileText className="mr-2 h-4 w-4" />
                  Create Assignment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
