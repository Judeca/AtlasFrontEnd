"use client"

import { useState,useEffect } from "react"

import api from "@/app/utils/axiosInstance"

import Link from "next/link"
import { ArrowLeft, ChevronRight, FolderPlus, Pencil, Trash2, FileText, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateChapterModal } from "@/components/create-chapter-modal"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"


export default function CoursePage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const [isCreateChapterModalOpen, setIsCreateChapterModalOpen] = useState(false)

  const [chapters,setChapters]=useState<any[]>([])
  const [quizze,setQuizzes]=useState<any[]>([])
  const [students,setStudents]=useState<any[]>([])

  // Mock course data
  const course = {
    title: "Welcome ",
    description: "Learn to Build Skills ",
    chapters: [
      {
        id: "ch1",
        title: "HTML Fundamentals",
        description: "Learn the building blocks of web pages",
        order: 1,
        lessonsCount: 3,
      },
      {
        id: "ch2",
        title: "CSS Styling",
        description: "Style your web pages with CSS",
        order: 2,
        lessonsCount: 2,
      },
      {
        id: "ch3",
        title: "JavaScript Basics",
        description: "Add interactivity to your websites",
        order: 3,
        lessonsCount: 2,
      },
    ],
    quizzes: [
      {
        id: "q1",
        title: "HTML Basics Quiz",
        description: "Test your knowledge of HTML fundamentals",
        questionsCount: 10,
        status: "published",
        createdAt: "2 weeks ago",
      },
      {
        id: "q2",
        title: "CSS Selectors Challenge",
        description: "Test your understanding of CSS selectors",
        questionsCount: 8,
        status: "draft",
        createdAt: "3 days ago",
      },
      {
        id: "q3",
        title: "JavaScript Functions Quiz",
        description: "Test your knowledge of JavaScript functions",
        questionsCount: 12,
        status: "published",
        createdAt: "1 week ago",
      },
    ],
  }

  useEffect(()=>{
    const fetchChapters = async () => {
      try {
        const response = await api.get(`chapter/courses/${courseId}/chapters`);
        setChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();

  },[])

  useEffect(()=>{
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(`quiz/quizzes/by-course/${courseId}`);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchQuizzes();

  },[])

  useEffect(()=>{
    const fetchStudents = async () => {
      try {
        const response = await api.get(`courseenrollement/courses/${courseId}/enrollments`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchStudents();

  },[])

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/teacher/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to courses</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
      </div>

      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Course Chapters</h2>
            <Button onClick={() => setIsCreateChapterModalOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Chapter
            </Button>
          </div>

          <div className="space-y-4">
            {chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{`Chapter ${chapter.order}`}</Badge>
                      <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit Chapter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Chapter
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Add Assignment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Chapter
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{chapter.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {chapter._count.lessons} {chapter.lessonsCount === 1 ? "lesson" : "lessons"}
                    </div>
                    <Link href={`/dashboard/teacher/courses/${courseId}/chapters/${chapter.id}`}>
                      <Button>
                        View Lessons
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Course Quizzes</h2>
            <Link href={`/dashboard/teacher/courses/${courseId}/quizzes/create`}>
              <Button>
                <HelpCircle className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {quizze.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <Badge variant={quiz.status === "PUBLISHED" ? "default" : "secondary"}>
                        {quiz.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit Quiz</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Quiz
                        </DropdownMenuItem>
                        {quiz.status === "DRAFT" && (
                          <DropdownMenuItem>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Publish Quiz
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Quiz
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/*<CardDescription>{quiz.description}</CardDescription>*/}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{quiz.quizcategorie} questions</span>
                      <span>Created {quiz.createdAt}</span>
                    </div>
                    <Link href={`/dashboard/teacher/courses/${courseId}/quizzes/${quiz.id}`}>
                      <Button>
                        View Quiz
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/teacher/courses/${courseId}/quizzes/${quiz.id}/edit`}>
                      <Button>
                        Add Questions
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Enrolled Students</h2>
            <div className="flex gap-2">
              <Link href={`/dashboard/teacher/courses/${courseId}/rankings`}>
                <Button variant="outline">View Rankings</Button>
              </Link>
              <Button variant="outline">Export List</Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage students enrolled in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <span className="text-xs font-medium">⭐</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium"> {student.student.firstName}{student.student.lastName}</p>
                        <p className="text-xs text-muted-foreground">{student.student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/*<Badge variant={i % 2 === 0 ? "default" : "outline"}>{i % 2 === 0 ? "Active" : "Inactive"}</Badge>*/}
                      <Button variant="ghost" size="sm">
                        View Progress
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>Manage your course settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">These actions cannot be undone</p>
                  <div className="flex items-center justify-between rounded-md border border-destructive/20 p-4">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Course</h4>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete the course and all its content
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

      <CreateChapterModal
        courseId={courseId}
        isOpen={isCreateChapterModalOpen}
        onClose={() => setIsCreateChapterModalOpen(false)}
      />
    </div>
  )
}

