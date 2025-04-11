"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, FilePlus, Pencil, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useParams } from "next/navigation"




export default function LessonPage() {
  const { courseId, chapterId,lessonId } = useParams() as { courseId: string; chapterId: string; lessonId:string; }
  const [isEditing, setIsEditing] = useState(false)
  const [lessonData, setLessonData] = useState({
    title: "Introduction to HTML",
    content:
      "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the meaning and structure of web content.\n\nHTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects such as interactive forms may be embedded into the rendered page.",
    duration: "15",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLessonData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setIsEditing(false)
      toast.success("Lesson updated", {
        description: "Your changes have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/teacher/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to course</span>
          </Button>
        </Link>
        <div className="flex-1">
          {isEditing ? (
            <Input
              name="title"
              value={lessonData.title}
              onChange={handleChange}
              className="text-xl font-bold h-auto py-1"
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">{lessonData.title}</h1>
          )}
          <p className="text-muted-foreground">Chapter: HTML Fundamentals • Lesson 1</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Lesson
              </Button>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
              <CardDescription>The main content of this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={lessonData.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={lessonData.content}
                      onChange={handleChange}
                      rows={12}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{lessonData.duration} minutes</span>
                  </div>
                  <div className="prose max-w-none">
                    {lessonData.content.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="materials" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lesson Materials</CardTitle>
                <CardDescription>Additional resources for this lesson</CardDescription>
              </div>
              <Button>
                <FilePlus className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No materials added yet. Click the button above to add your first material.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Settings</CardTitle>
              <CardDescription>Configure settings for this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">These actions cannot be undone</p>
                  <div className="flex items-center justify-between rounded-md border border-destructive/20 p-4">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Lesson</h4>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete this lesson and all its materials
                      </p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

