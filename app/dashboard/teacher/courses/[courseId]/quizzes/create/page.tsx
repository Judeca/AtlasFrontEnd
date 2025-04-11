"use client"

import type React from "react"
import { useState,useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import api from "@/app/utils/axiosInstance" // Ensure axiosInstance is correctly set up



export default function CreateQuizPage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [quizId,setQuizId]=useState<any>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    courseId: courseId,
    createdBy: "", // Update this value dynamically if needed
    chapterId: null,
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

    // Convert duration from minutes to seconds before sending
    const quizData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) * 60 : 0
    }

    try {
      const response = await api.post("/quiz/create-quizzes", quizData)

      if (response.status === 201) {
        toast.success("Quiz created", {
          description: "You can now add questions to your quiz.",
        })

        console.log(response.data,response.data.id)
        setQuizId(response.data.id)
        router.push(`/dashboard/teacher/courses/${courseId}`)
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

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Ensure "userId" is the correct key
    if (userId) {
      setFormData((prev) => ({ ...prev, createdBy: userId }));
    }
  }, []);


  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/teacher/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to course</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
          <p className="text-muted-foreground">Set up the basic information for your quiz</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>
              Enter the basic information about your quiz. You'll add questions in the next step.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
                <p className="text-xs text-muted-foreground">Leave blank for no time limit</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quizcategorie">Quiz Category</Label>
                <Select onValueChange={handleSelectChange} value={formData.quizcategorie}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIXED">FIXED</SelectItem>
                    <SelectItem value="MIXED">MIXED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/teacher/courses/${courseId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
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
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
