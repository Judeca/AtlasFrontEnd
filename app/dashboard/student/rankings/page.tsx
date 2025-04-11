"use client"

import { useState } from "react"
import { Clock, Medal, Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StudentRankingsPage() {
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [selectedQuiz, setSelectedQuiz] = useState("HTML Basics Quiz")

  // Mock rankings data
  const overallRankings = [
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
  ]

  const courseRankings = {
    all: [
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
    ],
    "web-dev": [
      {
        id: "s2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        score: 95,
        completionRate: 98,
        quizzesTaken: 3,
        averageTime: "16:30",
      },
      {
        id: "s1",
        name: "rugal Yurib",
        email: "john.doe@example.com",
        score: 92,
        completionRate: 95,
        quizzesTaken: 3,
        averageTime: "15:20",
      },
      {
        id: "s5",
        name: "Michael Brown",
        email: "michael.brown@example.com",
        score: 88,
        completionRate: 90,
        quizzesTaken: 3,
        averageTime: "17:45",
      },
      {
        id: "s3",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        score: 85,
        completionRate: 85,
        quizzesTaken: 2,
        averageTime: "20:10",
      },
      {
        id: "s4",
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        score: 80,
        completionRate: 80,
        quizzesTaken: 2,
        averageTime: "22:30",
      },
    ],
  }

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

  // Find your position in the rankings
  const yourId = "s1" // rugal Yurib
  const yourOverallRank = overallRankings.findIndex((s) => s.id === yourId) + 1
  const yourCourseRank = courseRankings[selectedCourse as keyof typeof courseRankings].findIndex((s) => s.id === yourId) + 1
  const yourQuizRank = quizRankings[selectedQuiz as keyof typeof quizRankings].findIndex((s) => s.id === yourId) + 1

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Rankings</h1>
        <p className="text-muted-foreground">View your performance rankings across the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Overall Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{yourOverallRank}</div>
              <Trophy className="ml-2 h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground">Out of {overallRankings.length} students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Course Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{yourCourseRank}</div>
              <Trophy className="ml-2 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-muted-foreground">Out of {courseRankings[selectedCourse as keyof typeof courseRankings].length} students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Quiz Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{yourQuizRank}</div>
              <Trophy className="ml-2 h-5 w-5 text-amber-700" />
            </div>
            <p className="text-xs text-muted-foreground">Out of {quizRankings[selectedQuiz as keyof typeof quizRankings].length} students</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall">Overall Rankings</TabsTrigger>
          <TabsTrigger value="course">Course Rankings</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Rankings</TabsTrigger>
        </TabsList>

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
                {overallRankings.map((student, index) => (
                  <div
                    key={student.id}
                    className={`grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center ${student.id === yourId ? "bg-muted" : ""}`}
                  >
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

        <TabsContent value="course" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Course Performance Rankings</CardTitle>
                  <CardDescription>Students ranked by performance in specific courses</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Select Course:</span>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="web-dev">Web Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                {courseRankings[selectedCourse as keyof typeof courseRankings].map((student, index) => (
                  <div
                    key={student.id}
                    className={`grid grid-cols-7 gap-4 p-4 border-b last:border-0 items-center ${student.id === yourId ? "bg-muted" : ""}`}
                  >
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
                  <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a quiz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HTML Basics Quiz">HTML Basics Quiz</SelectItem>
                      <SelectItem value="CSS Selectors Challenge">CSS Selectors Challenge</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <div
                    key={student.id}
                    className={`grid grid-cols-6 gap-4 p-4 border-b last:border-0 items-center ${student.id === yourId ? "bg-muted" : ""}`}
                  >
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
      </Tabs>
    </div>
  )
}

