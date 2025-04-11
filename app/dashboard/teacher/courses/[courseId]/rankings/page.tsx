"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Medal, Trophy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useParams } from "next/navigation"



export default function RankingsPage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  // Mock rankings data
  const courseRankings = [
    {
      id: "s1",
      name: "rugal Yurib",
      email: "john.doe@example.com",
      score: 92,
      completionRate: 95,
      quizzesTaken: 5,
      averageTime: "15:20",
    },
    {
      id: "s2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      score: 88,
      completionRate: 90,
      quizzesTaken: 5,
      averageTime: "18:45",
    },
    {
      id: "s3",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      score: 85,
      completionRate: 85,
      quizzesTaken: 4,
      averageTime: "20:10",
    },
    {
      id: "s4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      score: 82,
      completionRate: 80,
      quizzesTaken: 4,
      averageTime: "22:30",
    },
    {
      id: "s5",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      score: 78,
      completionRate: 75,
      quizzesTaken: 3,
      averageTime: "19:15",
    },
  ]

  const quizRankings = {
    "HTML Basics Quiz": [
      {
        id: "s1",
        name: "rugal Yurib",
        score: 95,
        timeTaken: "12:45",
        attempts: 1,
      },
      {
        id: "s2",
        name: "Jane Smith",
        score: 90,
        timeTaken: "15:20",
        attempts: 1,
      },
      {
        id: "s3",
        name: "Alex Johnson",
        score: 85,
        timeTaken: "18:10",
        attempts: 2,
      },
      {
        id: "s4",
        name: "Sarah Williams",
        score: 80,
        timeTaken: "20:30",
        attempts: 1,
      },
      {
        id: "s5",
        name: "Michael Brown",
        score: 75,
        timeTaken: "16:15",
        attempts: 2,
      },
    ],
    "CSS Selectors Challenge": [
      {
        id: "s2",
        name: "Jane Smith",
        score: 92,
        timeTaken: "14:30",
        attempts: 1,
      },
      {
        id: "s1",
        name: "rugal Yurib",
        score: 88,
        timeTaken: "16:15",
        attempts: 1,
      },
      {
        id: "s5",
        name: "Michael Brown",
        score: 85,
        timeTaken: "15:45",
        attempts: 1,
      },
      {
        id: "s3",
        name: "Alex Johnson",
        score: 80,
        timeTaken: "18:20",
        attempts: 2,
      },
      {
        id: "s4",
        name: "Sarah Williams",
        score: 75,
        timeTaken: "19:10",
        attempts: 2,
      },
    ],
  }

  const [selectedQuiz, setSelectedQuiz] = useState(Object.keys(quizRankings)[0])

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
          <h1 className="text-3xl font-bold tracking-tight">Course Rankings</h1>
          <p className="text-muted-foreground">View student performance rankings for this course</p>
        </div>
      </div>

      <Tabs defaultValue="course" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="course">Course Rankings</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Rankings</TabsTrigger>
          <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="course" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance Rankings</CardTitle>
              <CardDescription>Students ranked by overall performance in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
                  <div>Rank</div>
                  <div className="col-span-2">Student</div>
                  <div>Score</div>
                  <div>Completion</div>
                  <div>Quizzes</div>
                  <div>Avg. Time</div>
                </div>
                {courseRankings.map((student, index) => (
                  <div key={student.id} className="grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : index === 1 ? (
                        <Trophy className="h-5 w-5 text-gray-400" />
                      ) : index === 2 ? (
                        <Trophy className="h-5 w-5 text-amber-700" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div>{student.score}%</div>
                    <div>{student.completionRate}%</div>
                    <div>{student.quizzesTaken}</div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{student.averageTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Quiz Performance Rankings</CardTitle>
                  <CardDescription>Students ranked by performance in specific quizzes</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Select Quiz:</span>
                  <select
                    className="rounded-md border p-2 text-sm"
                    value={selectedQuiz}
                    onChange={(e) => setSelectedQuiz(e.target.value)}
                  >
                    {Object.keys(quizRankings).map((quiz) => (
                      <option key={quiz} value={quiz}>
                        {quiz}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 gap-4 p-4 font-medium border-b">
                  <div>Rank</div>
                  <div className="col-span-2">Student</div>
                  <div>Score</div>
                  <div>Time Taken</div>
                  <div>Attempts</div>
                </div>
                {quizRankings[selectedQuiz as keyof typeof quizRankings].map((student, index) => (
                  <div key={student.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : index === 1 ? (
                        <Trophy className="h-5 w-5 text-gray-400" />
                      ) : index === 2 ? (
                        <Trophy className="h-5 w-5 text-amber-700" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                      </div>
                    </div>
                    <div>{student.score}%</div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{student.timeTaken}</span>
                    </div>
                    <div>{student.attempts}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overall" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Platform Rankings</CardTitle>
              <CardDescription>Top performing students across all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 gap-4 p-4 font-medium border-b">
                  <div>Rank</div>
                  <div className="col-span-2">Student</div>
                  <div>Avg. Score</div>
                  <div>Courses</div>
                  <div>Quizzes</div>
                  <div>Badges</div>
                </div>
                {[
                  {
                    id: "s2",
                    name: "Jane Smith",
                    email: "jane.smith@example.com",
                    avgScore: 94,
                    courses: 5,
                    quizzes: 15,
                    badges: 8,
                  },
                  {
                    id: "s1",
                    name: "rugal Yurib",
                    email: "john.doe@example.com",
                    avgScore: 91,
                    courses: 4,
                    quizzes: 12,
                    badges: 7,
                  },
                  {
                    id: "s5",
                    name: "Michael Brown",
                    email: "michael.brown@example.com",
                    avgScore: 88,
                    courses: 6,
                    quizzes: 18,
                    badges: 9,
                  },
                  {
                    id: "s3",
                    name: "Alex Johnson",
                    email: "alex.johnson@example.com",
                    avgScore: 85,
                    courses: 3,
                    quizzes: 9,
                    badges: 5,
                  },
                  {
                    id: "s4",
                    name: "Sarah Williams",
                    email: "sarah.williams@example.com",
                    avgScore: 82,
                    courses: 4,
                    quizzes: 12,
                    badges: 6,
                  },
                ].map((student, index) => (
                  <div key={student.id} className="grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : index === 1 ? (
                        <Trophy className="h-5 w-5 text-gray-400" />
                      ) : index === 2 ? (
                        <Trophy className="h-5 w-5 text-amber-700" />
                      ) : (
                        <span className="font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div>{student.avgScore}%</div>
                    <div>{student.courses}</div>
                    <div>{student.quizzes}</div>
                    <div className="flex items-center gap-1">
                      <Medal className="h-4 w-4" />
                      <span>{student.badges}</span>
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

