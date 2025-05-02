"use client"
import Link from "next/link"
import { ArrowLeft, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import api from "@/app/utils/axiosInstance"
import { toast } from "sonner"
import { useParams } from "next/navigation"




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

export default function QuizRankingsPage()  {
  const { courseId, quizId } = useParams() as { courseId: string; quizId: string }
  const [rankings, setRankings] = useState<QuizRanking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yourRank, setYourRank] = useState<number | null>(null)
  const [yourData, setYourData] = useState<QuizRanking | null>(null)
  const [userId,setUserId]=useState("")

  useEffect(() => { 
    const userID = localStorage.getItem("userId");  
    console.log("HERE IS ",userID) 
    if (userID) { 
    console.log(userID) 
    setUserId(userID) 
    } 
    },[userId] ); 


  useEffect(() => {
    if(!quizId ||!userId ){
      return;
    }
    const fetchRankings = async () => {
      try {
        const response = await api.get(`/quiz/quizzes-ranking/${quizId}`)
        if (response.data) {
          setRankings(response.data)
          
          
          if (userId) {
            const yourRanking = response.data.find((r: QuizRanking) => r.studentId === userId)
            if (yourRanking) {
              setYourRank(yourRanking.rank)
              setYourData(yourRanking)
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
  }, [quizId,userId])

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
          <Button variant="outline">Back to course</Button>
        </Link>
      </div>
    )
  }

  if (!rankings.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div>No rankings available yet</div>
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
      </div>
    )
  }

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to quiz</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Rankings</h1>
          <p className="text-muted-foreground">{rankings[0]?.courseTitle || 'Quiz Results'}</p>
        </div>
      </div>

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
    <div className="rounded-md border overflow-hidden">
      {/* Desktop Header (hidden on mobile) */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">Student</div>
        <div className="col-span-2 text-center">Score</div>
        <div className="col-span-2 text-center">Attempt</div>
        <div className="col-span-2 text-right">Time</div>
      </div>
      
      {rankings.map((student) => {
        const isYou = yourData?.studentId === student.studentId;
        return (
          <div
            key={student.studentId}
            className={`grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 p-3 md:p-4 border-b last:border-0 items-center ${
              isYou ? "bg-primary/5" : "hover:bg-muted/50"
            } transition-colors`}
          >
            {/* Rank (Mobile: Top Left) */}
            <div className="col-span-1 flex items-center order-1">
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

            {/* Student Info (Mobile: Full Width) */}
            <div className="col-span-2 md:col-span-5 flex items-center gap-3 order-3 md:order-2">
              <Avatar className="h-9 w-9 md:h-8 md:w-8">
                <AvatarFallback>
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {student.firstName} {student.lastName}
                  {isYou && <span className="ml-2 text-xs text-primary">(You)</span>}
                </p>
                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
              </div>
            </div>

            {/* Score (Mobile: Top Right) */}
            <div className="col-span-1 flex justify-end md:justify-center items-center order-2 md:order-3">
              <div className="bg-muted md:bg-transparent rounded-full px-2 py-1 md:px-0 md:py-0">
                <span className="font-medium">{student.score}</span>
                <span className="text-muted-foreground text-xs">/{student.totalScore}</span>
              </div>
            </div>

            {/* Attempt (Mobile: Bottom Left) */}
            <div className="col-span-1 flex items-center order-4">
              <span className="md:hidden text-sm text-muted-foreground mr-1">Attempt:</span>
              <span className="font-medium">#{student.attemptNumber}</span>
            </div>

            {/* Time Taken (Mobile: Bottom Right) */}
            <div className="col-span-1 flex justify-end items-center order-5">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm">{formatTime(student.timeTaken)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </CardContent>
</Card>
      
    </div>
  )
}