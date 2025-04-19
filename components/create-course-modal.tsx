"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner"; 

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import api from "@/app/utils/axiosInstance"

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId:string
}

export function CreateCourseModal({ isOpen, onClose,onSuccess,userId }: CreateCourseModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Validation Error", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("course/create-courses", {
        title: formData.title,
        description: formData.description,
        teacherId: userId
      });

      // Check for successful response
      if (response.status >= 200 && response.status < 300) {
        toast.success("Course created", {
          description: `"${formData.title}" has been created successfully.`,
        });

        // Reset form and close modal
        setFormData({ title: "", description: "" });
        onSuccess();
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
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new course. You can add chapters and lessons later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Introduction to Web Development"
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
                placeholder="Provide a brief description of your course"
                value={formData.description}
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
                "Create Course"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
