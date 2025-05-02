"use client"
import Link from "next/link"
import { ArrowLeft, Clock, Edit, Trash2, X } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/app/utils/axiosInstance"
import { useParams } from "next/navigation"
import { toast } from "sonner"

export default function QuizPage() {
  const { courseId, quizId } = useParams() as { courseId: string; quizId: string }
  const [quizzes, setQuizzes] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    alt: string
  } | null>(null)


  const fetchQuizzes = async () => {
    try {
      const response = await api.get(`/quiz/fetch-quizzes/${quizId}`)
      setQuizzes(response.data)
    } catch (error) {
      console.error("Error fetching quiz:", error)
    }
  }
  useEffect(() => {
    fetchQuizzes()
  }, [quizId])

  const handleImageClick = (url: string, alt: string) => {
    setSelectedImage({ url, alt })
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  const deletequestion=async(questionId:string)=>{
    try {
      const response = await api.delete(`/question/delete-questions/${questionId}`);
      toast.success('Question removed successfully');
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz", error);
    }
  }

  if (!quizzes) return (
    <div className="flex items-center justify-center h-32">
      <div>Fetching...</div>
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="grid gap-6">
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-[80vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}

    
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/teacher/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to course</span>
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{quizzes.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.questions.length}</div>
            <p className="text-xs text-muted-foreground">{quizzes.totalScore} total points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizzes.duration / 60} min</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="questions">Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Questions</CardTitle>
              <CardDescription>All questions in this quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizzes.questions.map((question: any, index: any) => (
                  <div key={question.id} className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Q{index + 1}</Badge>
                        <Badge variant="secondary">{question.difficulty}</Badge>
                        <Button onClick={() => deletequestion(question.id)}>
                        <Trash2 className="mr-2 h-1 w-1" />
                        Delete
                      </Button> 
                      </div>
                    </div>
                    <p className="font-medium mt-2">{question.text}</p>
                    {question.fileName && (
                      <img 
                        src={question.fileUrl} 
                        alt={question.fileName || "Question image"}
                        className="max-h-40 rounded-md border mt-2 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(question.fileUrl, question.fileName)}
                      />
                    )}
                    <div className="mt-2 space-y-2">
                      {question.options.map((option: any) => (
                        <div key={option.id} className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${option.isCorrect ? "bg-green-500" : "bg-gray-200"}`}
                          />
                          <p className={option.isCorrect ? "text-green-600 font-medium" : ""}>
                            {option.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}