"use client"
import Link from "next/link"
import { ArrowLeft, Check, Clock, Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import api from "@/app/utils/axiosInstance"
import { toast } from "sonner"
import { useParams } from "next/navigation"

interface QuizResult {
  quizTitle: string
  score: number
  totalScore:number
  passingScore: number
  timeTaken: string
  totalQuestions: number
  numberOfQuestionFailed:number
  numberOfQuestionPassed:number
  correctAnswers: number
  submittedAt: string
  ranking?: number
  totalParticipants?: number
  questions: {
    questionId: string
    text: string
    type: string
    points: number
    earnedPoints: number
    userAnswer: string[]
    correctAnswer: string[]
    options: {
      id: string
      text: string
    }[]
  }[]
}

export default function QuizResultsPage() {
  const { courseId, quizId } = useParams() as { courseId: string; quizId: string }
  const [results, setResults] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    
    if(!quizId){
      return;
    }
    const fetchResults = async () => {
      try {
        const attempId=localStorage.getItem("attemptIdforscore");
    console.log(attempId)
        const response = await api.get(`quizattemp/quiz-attempts/${attempId}/results`)
        if (response.data) {
          setResults(response.data)
        } else {
          setError("No results data returned")
        }
      } catch (error) {
        console.error("Error viewing results:", error)
        setError("Failed to load results")
        toast.error("Failed to load results")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [quizId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div> 
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500">{error}</div>
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="outline">Back to Course</Button>
        </Link>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div>No results found</div>
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="outline">Back to Course</Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
          <p className="text-muted-foreground">{results.quizTitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Score</CardTitle>
            <CardDescription>Submitted on {new Date(results.submittedAt).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-muted">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{results.score}</span>
                </div>
                <svg
                  className="absolute -top-8 -right-8 h-16 w-16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {results.score >= results.passingScore ? (
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                      className="fill-green-100 stroke-green-500"
                    />
                  ) : (
                    <path
                      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                      className="fill-red-100 stroke-red-500"
                    />
                  )}
                  {results.score >= results.passingScore ? (
                    <path d="M8 11.8571L10.5 14.3572L15.8572 9" className="stroke-green-500" strokeWidth="2.5" />
                  ) : (
                    <>
                      <path d="M15 9l-6 6" className="stroke-red-500" strokeWidth="2.5" />
                      <path d="M9 9l6 6" className="stroke-red-500" strokeWidth="2.5" />
                    </>
                  )}
                </svg>
              </div>

              <div className="mt-6 w-full max-w-md space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Passing Score: {results.passingScore}</span>
                    <span>Total Score: {results.totalScore}</span>
                  </div>
                  <Progress
                    value={results.score}
                    className="h-2"
                  />
                </div>

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Time Taken: {results.timeTaken}</span>
                    </div>
                    {results.ranking && results.totalParticipants && (
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Rank: {results.ranking} of {results.totalParticipants}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Link href={`/dashboard/student/courses/${courseId}`}>
                    <Button variant="outline">Back to Course</Button>
                  </Link>
                  <Link href={`/dashboard/student/courses/${courseId}/quizzes/${quizId}/rankings`}>
                    <Button>
                      <Trophy className="mr-2 h-4 w-4" />
                      View Rankings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Breakdown</CardTitle>
            <CardDescription>Detailed analysis of your quiz performance</CardDescription>
          </CardHeader>
      <CardContent>
          <div className="mt-6 space-y-2">
      <h3 className="text-sm font-medium">Quiz Summary</h3>
      <div className="rounded-md bg-muted p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Total Questions</span>
          <span className="text-sm font-medium">{results.totalQuestions}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Questions Passed</span>
          <span className="text-sm font-medium">{results.numberOfQuestionPassed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Questions Failed</span>
          <span className="text-sm font-medium">{results.numberOfQuestionFailed}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Total Quiz Score</span>
          <span className="text-sm font-medium">{results.totalScore}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Passing Quiz Score</span>
          <span className="text-sm font-medium">{results.passingScore}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Your Score</span>
          <span className="text-sm font-medium">{results.score}</span>
        </div>
       
       
        <div className="flex items-center justify-between">
          <span className="text-sm">Time Taken</span>
          <span className="text-sm font-medium">{results.timeTaken} mins</span>
        </div>
      </div>
    </div>
  
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>Review your answers and see the correct solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.questions.map((question, index) => (
              <div key={question.questionId} className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Q{index + 1}</Badge>
                    <Badge>{question.points} pts</Badge>
                    <Badge variant="secondary">
                      {question.type === "multiple-choice" ? "Single Answer" : "Multiple Answers"}
                    </Badge>
                  </div>
                  <Badge variant={question.earnedPoints === question.points ? "default" : "destructive"}>
                    {question.earnedPoints === question.points ? (
                      <div className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        <span>Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <X className="h-3 w-3" />
                        <span>Incorrect</span>
                      </div>
                    )}
                  </Badge>
                </div>

                <h3 className="mt-2 font-medium">{question.text}</h3>

                <div className="mt-3 space-y-2">
                  {question.options.map((option) => {
                    const isUserAnswer = question.userAnswer.includes(option.id)
                    const isCorrectAnswer = question.correctAnswer.includes(option.id)

                    let className = "flex items-center gap-2 rounded-md p-2 "

                    if (isUserAnswer && isCorrectAnswer) {
                      className += "bg-green-50 border-green-200 border"
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      className += "bg-red-50 border-red-200 border"
                    } else if (!isUserAnswer && isCorrectAnswer) {
                      className += "bg-blue-50 border-blue-200 border"
                    } else {
                      className += "border"
                    }

                    return (
                      <div key={option.id} className={className}>
                        {isUserAnswer && isCorrectAnswer && <Check className="h-4 w-4 text-green-500" />}
                        {isUserAnswer && !isCorrectAnswer && <X className="h-4 w-4 text-red-500" />}
                        {!isUserAnswer && isCorrectAnswer && <Check className="h-4 w-4 text-blue-500" />}
                        {!isUserAnswer && !isCorrectAnswer && <div className="w-4" />}
                        <span>{option.text}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-2 text-sm">
                  <span className="font-medium">Points earned: </span>
                  <span>
                    {question.earnedPoints}/{question.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}