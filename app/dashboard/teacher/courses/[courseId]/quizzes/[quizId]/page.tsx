"use client"
import Link from "next/link"
import { ArrowLeft, Clock, Edit } from "lucide-react"
import {useState,useEffect} from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/app/utils/axiosInstance"
import { useParams } from "next/navigation"



export default function QuizPage() {
  const { courseId, quizId } = useParams() as { courseId: string; quizId: string }


const [quizzes, setQuizzes] = useState<any>(null);

useEffect(() => {
  const fetchQuizzes = async () => {
    try {
      const response = await api.get(`/quiz/fetch-quizzes/${quizId}`);
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  fetchQuizzes();
}, [quizId]);

if (!quizzes) return <p>Loading...</p>; // Handle loading state

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
              {quizzes.questions.map((question:any, index:any) => (
                <div key={question.id} className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge variant="secondary">{question.difficulty}</Badge>
                    </div>
                  </div>
                  <p className="font-medium mt-2">{question.text}</p>
                  <div>{question.fileName &&  <img 
                        src={question.fileUrl} 
                        alt={question.fileName || "Question image"}
                        className="max-h-40 rounded-md border"
                      />}</div>
                  <div className="mt-2 space-y-2">
                    {question.options.map((option:any) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${option.isCorrect ? "bg-green-500" : "bg-gray-200"}`}
                        />
                        <p className={option.isCorrect ? "text-green-600 font-medium" : ""}>{option.text}</p>
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
);
}