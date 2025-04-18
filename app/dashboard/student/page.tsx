// components/EnrolledCourses.tsx
"use client"
import { BookOpen, Clock, Layers, FileText, Users, Award, BarChart2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/app/utils/axiosInstance"
import { formatRelativeTime } from "@/app/utils/functions"

export default function EnrolledCourses() {
  const [userId, setUserId] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    activeStudents: 0,
    completionRate: 0
  })

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
        const response = await api.get(`/course/student-courses-threeinfo/${userId}`)
        setData(response.data)
        
        // Generate random stats for demonstration
        setStats({
          totalEnrolled: response.data.totalEnrolled || 0,
          activeStudents: Math.floor(Math.random() * 50) + 10, // Random between 10-60
          completionRate: Math.floor(Math.random() * 40) + 40 // Random between 40-80
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    if (userId) fetchData()
  }, [userId])

  const calculateCourseProgress = (course: any) => {
    if (course.chapterCount === 0) return 0
    return Math.floor(Math.random() * 40) + 40 // Random between 40-80
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Your Learning Dashboard</h3>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data.formattedCourses.length}</div>
                <p className="text-xs text-muted-foreground">Your learning journey</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeStudents}</div>
                <p className="text-xs text-muted-foreground">Learning together</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uploading Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
                <Progress value={stats.completionRate} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground">Overall activity</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Courses Section */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Your Recently Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.formattedCourses.map((course: any) => {
                const progress = calculateCourseProgress(course)
                return (
                  <div key={course.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <h4 className="text-lg font-medium">{course.title}</h4>
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
                          <span className="font-medium">
                            {progress > 0 ? "In Progress" : "Not Started"}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    </div>
                    
                    <Link href={`/dashboard/student/courses/${course.id}`} className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-[100px]">
                        Continue
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <Link href="/dashboard/student/courses">
              <Button variant="ghost" className="flex items-center gap-2">
                View All Enrolled Courses
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