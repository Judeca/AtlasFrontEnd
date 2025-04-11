"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, ChevronRight, FilePlus, Pencil, Trash2, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateLessonModal } from "@/components/create-lesson-modal"
import { CreateAssignmentModal } from "@/components/create-assignment-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"



export default function ChapterPage() {

  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false)
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false)

  // Mock chapter data
  const chapter = {
    id: chapterId,
    title: "HTML Fundamentals",
    description: "Learn the building blocks of web pages",
    order: 1,
    courseTitle: "Introduction to Web Development",
    lessons: [
      {
        id: "l1",
        title: "Introduction to HTML",
        duration: 15,
        order: 1,
      },
      {
        id: "l2",
        title: "HTML Elements and Attributes",
        duration: 20,
        order: 2,
      },
      {
        id: "l3",
        title: "HTML Forms",
        duration: 25,
        order: 3,
      },
    ],
    assignments: [
      {
        id: "a1",
        title: "Create a Basic HTML Page",
        description: "Build a simple webpage with various HTML elements",
        dueDate: "2023-05-15",
        submissionsCount: 18,
      },
    ],
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{chapter.title}</h1>
          <p className="text-muted-foreground">
            Course: {chapter.courseTitle} • Chapter {chapter.order}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Lessons</h2>
            <Button onClick={() => setIsCreateLessonModalOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Lesson
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chapter Lessons</CardTitle>
              <CardDescription>Manage the lessons in this chapter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapter.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Lesson {lesson.order}</Badge>
                          <p className="font-medium">{lesson.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{lesson.duration} minutes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Lesson</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Lesson
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Lesson
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Link
                        href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.id}`}
                      >
                        <Button>
                          View Lesson
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/3">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Assignments</h2>
            <Button onClick={() => setIsCreateAssignmentModalOpen(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Add Assignment
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chapter Assignments</CardTitle>
              <CardDescription>Manage assignments for this chapter</CardDescription>
            </CardHeader>
            <CardContent>
              {chapter.assignments.length > 0 ? (
                <div className="space-y-4">
                  {chapter.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex flex-col rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{assignment.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit Assignment</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Assignment
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Assignment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                      <div className="flex justify-between mt-4 text-sm">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span>{assignment.submissionsCount} submissions</span>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}`}
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            View Submissions
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No assignments yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create an assignment for students to complete</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsCreateAssignmentModalOpen(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Create Assignment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateLessonModal
        courseId={courseId}
        chapterId={chapterId}
        isOpen={isCreateLessonModalOpen}
        onClose={() => setIsCreateLessonModalOpen(false)}
      />

      <CreateAssignmentModal
        courseId={courseId}
        chapterId={chapterId}
        isOpen={isCreateAssignmentModalOpen}
        onClose={() => setIsCreateAssignmentModalOpen(false)}
      />
    </div>
  )
}

