"use client"
import Link from "next/link"
import { BookOpen, GraduationCap, Users, FileText, Layers, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import api from "@/app/utils/axiosInstance"
import { LinkWithLoading } from "@/components/link-with-loading"

interface Course {
  id: string
  title: string
  description: string
  createdAt: string
  chapterCount: number
  lessonCount: number
  assignmentCount: number
}

interface DashboardData {
  totalCourses: number
  lastCourses: Course[]
}

export default function TeacherDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const userID = localStorage.getItem("userId")
    if (userID) {
      setUserId(userID)
    }
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/course/teacher-courses-threeinfo/${userId}`)
        setData(response.data)
      } catch (err) {
        setError("Failed to fetch dashboard data")
        console.error("Error fetching dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="ml-4">
          Retry
        </Button>
      </div>
    )
  }

  // Calculate course progress (example logic - adjust based on your actual progress tracking)
  const calculateCourseProgress = (course: Course) => {
    // This is a placeholder - replace with your actual progress calculation
    if (course.chapterCount === 0) return 0
    return Math.min(Math.floor((Math.random() * 30) + 20), 100) // Random progress between 20-50% for demo
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your teaching activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground">Your teaching portfolio</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Currently going on</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Up coming Features</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">20++</div>
                <p className="text-xs text-muted-foreground">To be added</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Your Recent Courses</CardTitle>
          <CardDescription>The courses you've created recently</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-3 w-full max-w-[300px]" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {data?.lastCourses.map((course) => {
                const progress = calculateCourseProgress(course)
                return (
                  <div key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Layers className="h-4 w-4 text-muted-foreground" />
                          <span>{course.chapterCount} chapters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{course.lessonCount} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{course.assignmentCount} assignments</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 max-w-md">
                        <div className="flex justify-between text-sm">
                          <span>Course progress</span>
                          <span className="font-medium">{progress > 0 ? "In Progress" : "Not Started"}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                    
                     <LinkWithLoading
                      href={`/dashboard/teacher/courses/${course.id}`}
                      loadingText="Opening lesson..."
                    >
                      View
                    </LinkWithLoading>
                  </div>
                )
              })}
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <Link href="/dashboard/teacher/courses">
              <Button variant="ghost" className="flex items-center gap-2">
                View All Courses
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}