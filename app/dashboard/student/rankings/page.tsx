"use client"
import Link from "next/link"
import { ArrowLeft, Clock, Trophy, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import api from "@/app/utils/axiosInstance"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface QuizRanking {
  rank: number
  studentId: string
  firstName: string
  lastName: string
  email: string
  score: number
  timeTaken: number
  attemptNumber: number
  submittedAt: string
  courseTitle: string
  totalScore: number
}

interface Course {
  id: string
  title: string
  description: string
}

interface Quiz {
  id: string
  title: string
  totalScore: number
}

export default function QuizRankingsPage() {
  const [rankings, setRankings] = useState<QuizRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yourRank, setYourRank] = useState<number | null>(null)
  const [yourData, setYourData] = useState<QuizRanking | null>(null)
  const [userId, setUserId] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedQuizId, setSelectedQuizId] = useState<string>("")
  const [loadingQuizzes, setLoadingQuizzes] = useState(false)

  useEffect(() => {
    const userID = localStorage.getItem("userId")
    if (userID) {
      setUserId(userID)
    }
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/course/getAll-courses")
        setCourses(response.data)
      } catch (error) {
        console.error("Error fetching courses:", error)
        toast.error("Failed to load courses")
      }
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    if (!selectedCourseId) return

    const fetchQuizzes = async () => {
      setLoadingQuizzes(true)
      try {
        const response = await api.get(`/quiz/quizzes/by-course/${selectedCourseId}`)
        setQuizzes(response.data)
        setSelectedQuizId("") // Reset quiz selection when course changes
      } catch (error) {
        console.error("Error fetching quizzes:", error)
        toast.error("Failed to load quizzes for this course")
      } finally {
        setLoadingQuizzes(false)
      }
    }

    fetchQuizzes()
  }, [selectedCourseId])

  useEffect(() => {
    if (!selectedQuizId || !userId) return

    const fetchRankings = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/quiz/quizzes-ranking/${selectedQuizId}`)
        if (response.data) {
          setRankings(response.data)
          
          if (userId) {
            const yourRanking = response.data.find((r: QuizRanking) => r.studentId === userId)
            if (yourRanking) {
              setYourRank(yourRanking.rank)
              setYourData(yourRanking)
            }else {
              setYourRank(null)
              setYourData(null)
            }
          }
        } else {
          setError("No rankings data returned")
        }
      } catch (error) {
        console.error("Error fetching rankings:", error)
        setError("Failed to load rankings")
        toast.error("Failed to load rankings")
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [selectedQuizId, userId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/student">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to performance</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Rankings</h1>
          <p className="text-muted-foreground">View performance rankings for quizzes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
            <CardDescription>Choose a course to view available quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedCourseId}
              onValueChange={(value) => setSelectedCourseId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Quiz</CardTitle>
            <CardDescription>
              {selectedCourseId ? "Choose a quiz to view rankings" : "Select a course first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedQuizId}
              onValueChange={(value) => setSelectedQuizId(value)}
              disabled={!selectedCourseId || loadingQuizzes}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingQuizzes ? "Loading quizzes..." : "Select a quiz"} />
              </SelectTrigger>
              <SelectContent>
                {quizzes.map((quiz) => (
                  <SelectItem key={quiz.id} value={quiz.id}>
                    {quiz.title} (Max score: {quiz.totalScore})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {loading && selectedQuizId && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-red-500">{error}</div>
        </div>
      )}

      {!loading && selectedQuizId && rankings.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div>No rankings available yet for this quiz</div>
        </div>
      )}

      {!loading && selectedQuizId && rankings.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Rank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold">{yourRank || 'N/A'}</div>
                  {yourRank === 1 && <Trophy className="ml-2 h-5 w-5 text-yellow-500" />}
                </div>
                <p className="text-xs text-muted-foreground">Out of {rankings.length} participants</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {yourData ? `${yourData.score}/${yourData.totalScore}` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {yourData ? `Attempt #${yourData.attemptNumber}` : 'Not attempted'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {yourData ? formatTime(yourData.timeTaken) : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {yourData ? new Date(yourData.submittedAt).toLocaleString() : ''}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
  <CardHeader>
    <CardTitle>Quiz Performance Rankings</CardTitle>
    <CardDescription>
      Students ranked by performance in this quiz (latest attempt shown)
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="rounded-md border">
      {/* Header - Hidden on small screens */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 font-medium border-b">
        <div className="col-span-1">Rank</div>
        <div className="col-span-4">Student</div>
        <div className="col-span-2">Score</div>
        <div className="col-span-2">Attempt</div>
        <div className="col-span-3">Time Taken</div>
      </div>
      
      {rankings.map((student) => {
        const isYou = yourData?.studentId === student.studentId;
        return (
          <div
            key={student.studentId}
            className={`grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 border-b last:border-0 items-center ${
              isYou ? "bg-muted" : ""
            }`}
          >
            {/* Rank Column */}
            <div className="col-span-1 flex items-center">
              {student.rank === 1 ? (
                <Trophy className="h-5 w-5 text-yellow-500" />
              ) : student.rank === 2 ? (
                <Trophy className="h-5 w-5 text-gray-400" />
              ) : student.rank === 3 ? (
                <Trophy className="h-5 w-5 text-amber-700" />
              ) : (
                <span className="font-medium">#{student.rank}</span>
              )}
            </div>

            {/* Student Info Column */}
            <div className="col-span-1 md:col-span-4 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {student.firstName} {student.lastName}
                  {isYou && <span className="ml-2 text-xs text-muted-foreground">(You)</span>}
                </p>
                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
              </div>
            </div>

            {/* Score Column */}
            <div className="col-span-1 md:col-span-2 flex md:block">
              <span className="md:hidden font-semibold mr-2">Score:</span>
              <span>{student.score}/{student.totalScore}</span>
            </div>

            {/* Attempt Column */}
            <div className="col-span-1 md:col-span-2 flex md:block">
              <span className="md:hidden font-semibold mr-2">Attempt:</span>
              <span>#{student.attemptNumber}</span>
            </div>

            {/* Time Taken Column */}
            <div className="col-span-1 md:col-span-3 flex items-center">
              <span className="md:hidden font-semibold mr-2">Time:</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatTime(student.timeTaken)}</span>
            </div>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>
        </>
      )}
    </div>
  )
}