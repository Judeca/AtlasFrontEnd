"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import api from "@/app/utils/axiosInstance"
import { IconLinkWithLoading } from "@/components/icon-link-with-loading"



interface Answer {
  questionId: string
  chosenOptions: string[]
}

interface Quiz {
  id: string
  title: string
  courseId: string
  status: string
  totalScore: number
  passingScore: number
  quizcategorie: string
  duration: number
  questions: {
    id: string
    text: string
    questionType: string
    fileName:string
    fileUrl:string 
    difficulty: string
    options: {
      id: string
      text: string
      isCorrect: boolean
    }[]
  }[]
}

export default function QuizPage() {
  const { courseId, quizId } = useParams() as { courseId: string; quizId: string }
  const router = useRouter()
  const [answers, setAnswers] = useState<Answer[]>([])
  const answersRef = useRef<Answer[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0) // in seconds
  const [attemptId, setAttemptId] = useState("")
  const [userId, setUserId] = useState("")
  const [timeTaken, setTimeTaken] = useState(0)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const startTime = useRef(Date.now()) 

const testtime=()=>{
  const endtime=Date.now()
  console.log("starttime:",startTime)
  console.log("endtime:",endtime)
  console.log("timetaken:",(endtime-startTime.current)/1000) 
}

  useEffect(() => { 

    const userID = localStorage.getItem("userId");  
    console.log("HERE IS ",userID) 
    if (userID) { 
    console.log(userID) 
    setUserId(userID) 
    } 
    
    },[userId] ); 

  // Fetch quiz data from API
  useEffect(() => {
    if(!quizId){
      return;
    }
    const fetchQuiz = async () => {
      try {
        const response = await api.get(`/quiz/fetch-quizzes/${quizId}`)
        setQuiz(response.data)
        setTimeLeft(response.data.duration)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching quiz:", error)
        toast.error("Failed to load quiz")
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  // Timer effect
  useEffect(() => {
    if (!quiz) return;

    const savedDeadline = localStorage.getItem("quizDeadline");

    let deadline: number;
    if (savedDeadline) {
      deadline = parseInt(savedDeadline, 10);
    } else {
      const durationInSeconds = quiz.duration; //quiz time 
      deadline = Date.now() + durationInSeconds * 1000;
      localStorage.setItem("quizDeadline", deadline.toString());
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const timeLeftInSeconds = Math.round((deadline - now) / 1000);
  
      if (timeLeftInSeconds <= 0) {
        clearInterval(timer);
        localStorage.removeItem("quizDeadline");
        handleTimeoutSubmit();
        setTimeLeft(0);
      } else {
        setTimeLeft(timeLeftInSeconds);
      }
    }, 1000);

    return () => clearInterval(timer)
  }, [quiz])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const calculateTimeTaken = () => {
    const endTime = Date.now()
    const timeSpent = Math.floor((endTime - startTime.current) / 1000)
    console.log("Here is the time spent:",timeSpent)
    return Math.min(timeSpent, quiz?.duration || 0)
  } 

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const existingAnswerIndex = prev.findIndex(a => a.questionId === questionId)
      let newAnswers;
      
      if (existingAnswerIndex >= 0) {
        newAnswers = [...prev]
        newAnswers[existingAnswerIndex] = {
          questionId,
          chosenOptions: [optionId]
        }
      } else {
        newAnswers = [
          ...prev,
          {
            questionId,
            chosenOptions: [optionId]
          }
        ]
      }
      
      answersRef.current = newAnswers // Update the ref
      return newAnswers
    })
  }

  const handleTimeoutSubmit = async () => {
    if (!quiz) return
    
    setIsSubmitting(true)
    const finalTimeTaken = calculateTimeTaken()
    setTimeTaken(finalTimeTaken)
    
    const submissionData = {
      answers: quiz.questions.map(question => ({
        questionId: question.id,
        chosenOptions: answersRef.current.find(a => a.questionId === question.id)?.chosenOptions || []
      })),
      timeTaken: finalTimeTaken
    }

    const attemptCreation = {
      quizId: quizId,
      studentId: userId,
      timeTaken: finalTimeTaken
    }

    const timeToSend = {
      timeTaken: `${finalTimeTaken}`,
    }


    
    try {  
      const response = await api.post(`/quizattemp/createquiz-attempts`, attemptCreation)
      if (response.status === 201) {
        const newAttemptId = response.data.id 
        setAttemptId(newAttemptId)
        localStorage.setItem("attemptIdforscore", newAttemptId)
        toast.success("Quiz attempt created successfully")

        try { 
          const response = await api.post(
            `/quizattemp/quiz-attempts/${newAttemptId}/submit-answers`,
            submissionData
          )
          if (response) {
            toast.success("Quiz finish Auto submition!!")
            try {
              await api.post(
                `/quizattemp/quiz-attempts/${newAttemptId}/calculate-score`,
                timeToSend
              )
              router.push(`/dashboard/student/courses/${courseId}/quizzes/${quizId}/results`)
            } catch(error) {
              console.error("Error calculating score:", error)
              toast.error("Error calculating score")
            }
          }
        } catch(error) {
          console.error("Error submitting answers:", error)
          toast.error("Error submitting answers")
        }
      }
    }  catch (error) {
      console.error("Timeout submission error:", error)
      toast.error("Failed to auto-submit quiz")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quiz) return
    
    setIsSubmitting(true)
    const finalTimeTaken = calculateTimeTaken()
    setTimeTaken(finalTimeTaken)

    const submissionData = {
      answers: quiz.questions.map(question => ({
        questionId: question.id,
        chosenOptions: answers.find(a => a.questionId === question.id)?.chosenOptions || []
      }))
    }

    const attemptCreation = {
      quizId: quizId,
      studentId: userId,
      timeTaken: finalTimeTaken
    }

    const timeToSend = {
      timeTaken: `${finalTimeTaken}`,
    }

    try {  
      const response = await api.post(`/quizattemp/createquiz-attempts`, attemptCreation)
      if (response.status === 201) {
        const newAttemptId = response.data.id 
        setAttemptId(newAttemptId)
        localStorage.setItem("attemptIdforscore", newAttemptId)
        toast.success("Quiz attempt created successfully")

        try { 
          const response = await api.post(
            `/quizattemp/quiz-attempts/${newAttemptId}/submit-answers`,
            submissionData
          )
          if (response) {
            localStorage.removeItem("quizDeadline");
            try {
              await api.post(
                `/quizattemp/quiz-attempts/${newAttemptId}/calculate-score`,
                timeToSend
              )
              router.push(`/dashboard/student/courses/${courseId}/quizzes/${quizId}/results`)
            } catch(error) {
              console.error("Error calculating score:", error)
              toast.error("Error calculating score")
            }
          }
        } catch(error) {
          console.error("Error submitting answers:", error)
          toast.error("Error submitting answers")
        }
      }
    } catch (error) {
      console.error("Error creating attempt:", error)
      toast.error("Failed to create quiz attempt")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div>Quiz not found</div>
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconLinkWithLoading
            href={`/dashboard/student/courses/${courseId}`}
            icon={<ArrowLeft className="h-4 w-4" />}
            srText="Back to courses"
            variant="ghost"
          /> 
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
            <p className="text-muted-foreground">
              Total points: {quiz.totalScore} | Passing score: {quiz.passingScore}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg py-1 px-3">
            <Clock className="mr-1 h-4 w-4" />
            {formatTime(timeLeft)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main questions area */}
        <div className="flex-1 space-y-6 max-h-screen overflow-y-auto pr-4">
          {quiz.questions.map((question, index) => {
            const answer = answers.find(a => a.questionId === question.id)
            const selectedOptionId = answer?.chosenOptions?.[0]

            return (
              <Card key={question.id} id={`q-${question.id}`} className="scroll-mt-24">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Question {index + 1}</Badge>
                    <Badge variant="secondary" className="capitalize">
                      {question.difficulty.toLowerCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
                  <div>{question.fileUrl &&  <img 
                        src={question.fileUrl} 
                        alt={question.fileName || "Question image"}
                        className="max-h-40 rounded-md border"
                      />}</div> 

                  <RadioGroup
                    value={selectedOptionId || ""}
                    onValueChange={(value) => handleAnswerSelect(question.id, value)}
                    className="space-y-3"
                  >
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                        <Label htmlFor={`${question.id}-${option.id}`} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Question navigator */}
        <div className="md:w-64">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Question Navigator</CardTitle>
              <CardDescription>Jump to any question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {quiz.questions.map((question, index) => {
                  const isAnswered = answers.some(a => a.questionId === question.id)
                  
                  return (
                    <Button
                      key={question.id}
                      variant={isAnswered ? "secondary" : "outline"}
                      className="w-full justify-start"
                      onClick={() => {
                        document.getElementById(`q-${question.id}`)?.scrollIntoView({
                          behavior: 'smooth'
                        })
                      }}
                    >
                      Question {index + 1}
                      {isAnswered && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                  )
                })}
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Quiz"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}