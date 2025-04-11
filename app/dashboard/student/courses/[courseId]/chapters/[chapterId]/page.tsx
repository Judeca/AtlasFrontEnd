"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import api from "@/app/utils/axiosInstance"
import { toast } from "sonner"
import { useParams } from "next/navigation"



export default function ChapterPage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const router = useRouter()
  const [chapter, setChapter] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [assignments, setAssignments] = useState<any[]>([])
  const [loading, setLoading] = useState({
    chapter: true,
    lessons: true,
    assignments: true
  })
  const [error, setError] = useState({
    chapter: null,
    lessons: null,
    assignments: null
  })

  // Fetch chapter data
  useEffect(() => {
    const fetchChapterInfo = async () => {
      try {
        const response = await api.get(`/chapter/${chapterId}/chapter`)
        setChapter(response.data)
      } catch (err) {
        toast.error("Error Loading chapter info", {
          description: "Failed to load chapter information"
        })
        
      } finally {
        setLoading(prev => ({...prev, chapter: false}))
      }
    }
    fetchChapterInfo()
  }, [chapterId])

  // Fetch lessons with progress
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get(`/lesson/chapters/${chapterId}/lessons`)
        const lessonsWithProgress = response.data.map((lesson: any) => ({
          ...lesson,
          completed: lesson.progresses[0]?.status || 'NOT_STARTED',
          progress: lesson.progresses[0]?.progress || 0
        }))
        setLessons(lessonsWithProgress)
      } catch (err) {
        toast.error("Error Loading lessons", {
          description: "Failed to load lessons for this chapter"
        })
       
      } finally {
        setLoading(prev => ({...prev, lessons: false}))
      }
    }
    fetchLessons()
  }, [chapterId])

  // Fetch assignments in a chapter
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get(`/assignment/chapters/${chapterId}/assignments`)
        setAssignments(response.data)
      } catch (err) {
        toast.error("Error Loading assignments", {
          description: "Failed to load assignments for this chapter"
        })

         toast.error("Error LoadingAssignments ",{
          description:"Error Loading the assignments on your page"})

      } finally {
        setLoading(prev => ({...prev, assignments: false}))
      }
    }
    fetchAssignments()
  }, [chapterId])

  // Handle lesson start/continue
  const handleLessonStart = async (lessonId: string, completed: string) => {
    try {
      // Create progress record if it doesn't exist
      if (completed=='NOT_STARTED') {
        const response = await api.post('/lessonprogress/create-lesson-progress', {
          userId: localStorage.getItem('studentId'),
          lessonId
        })
        if (response) {
          console.log("Lesson progression started")
        } else {
          console.log("Failed to start lesson progression")
        }
      }
      
      router.push(`/dashboard/student/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`)
    } catch (error) {
      console.error('Error starting lesson:', error)
      toast.error("Error starting lesson", {
        description: "There was an issue starting the lesson"
      })
    }
  }

  // Calculate chapter progress based on lessons
  const calculateChapterProgress = () => {
    if (lessons.length === 0) return 0
    const completedLessons = lessons.filter(lesson => lesson.completed).length
    return Math.round((completedLessons / lessons.length) * 100)
  }

  if (loading.chapter) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error.chapter || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500">
          Failed to load chapter
        </div>
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to course</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{chapter.title}</h1>
          <p className="text-muted-foreground">
            {chapter.description} • Chapter {chapter.order}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Chapter Progress</CardTitle>
          <CardDescription>Track your progress through this chapter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{chapter.progresses[0].progress}%</span>
            </div>
            <Progress value={chapter.progresses[0].progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Lessons</CardTitle>
              <CardDescription>Complete all lessons to finish this chapter</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.lessons ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error.lessons ? (
                <div className="text-red-500 text-center py-4">
                  Failed to load lessons
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Lesson {lesson.order}</Badge>
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.completed==="COMPLETED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{lesson.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleLessonStart(lesson.id, lesson.completed)}
                      >
                        {lesson.completed === 'NOT_STARTED' 
                            ? 'Start Lesson'
                            : lesson.completed === 'IN_PROGRESS'
                            ? 'Continue Lesson'
                            : 'View Lesson'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Assignments</CardTitle>
              <CardDescription>Complete assignments to demonstrate your understanding</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.assignments ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error.assignments ? (
                <div className="text-red-500 text-center py-4">
                  Failed to load assignments
                </div>
              ) : assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex flex-col rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-medium">{assignment.title}</h3>
                        </div>
                        <Badge
                          variant={
                            assignment.status === "GRADED"
                              ? "default"
                              : assignment.status === "SUBMITTED"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {assignment.status === "GRADED"
                            ? "Graded"
                            : assignment.status === "SUBMITTED"
                              ? "Submitted"
                              : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                      <div className="flex justify-between mt-4 text-sm">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span>{assignment.maxScore} points</span>
                      </div>
                      <div className="mt-4">
                        <Link
                          href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}`}
                        >
                          <Button className="w-full">
                            {assignment.status === "GRADED"
                              ? "View Feedback"
                              : assignment.status === "SUBMITTED"
                                ? "View Submission"
                                : "Submit Assignment"}
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
                  <p className="text-sm text-muted-foreground mt-1">There are no assignments for this chapter yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}