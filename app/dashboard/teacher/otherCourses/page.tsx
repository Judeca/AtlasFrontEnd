"use client"

import { useState,useEffect } from "react"
import api from "@/app/utils/axiosInstance"
import Link from "next/link"
import { BookOpen, Loader2, MoreHorizontal, Plus, Search,File } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateCourseModal } from "@/components/create-course-modal"
import { formatRelativeTime } from "@/app/utils/functions"
import { toast } from "sonner"

export default function TeacherCoursesPage() {
  const [loadingCourses, setLoadingCourses] = useState<Record<string, boolean>>({})
  const [course ,setCourse]=useState<any[]>([]);
  const [userId,setUserId]=useState('')

  const [loading, setLoading] = useState({
   courses:true,
  })
 

  useEffect(() => {
    const userID = localStorage.getItem("userId"); 
    console.log("HERE IS ",userID)
    if (userID) {
      console.log(userID)
      setUserId(userID)
    }
  },[userId] );


  const updateCourseStatus = async (courseId: string, currentStatus: string) => {
    try {
      setLoadingCourses(prev => ({ ...prev, [courseId]: true }));
      
      const newStatus = currentStatus === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
      await api.put(`/course/update-course-status/${courseId}`, { status: newStatus });
      
      // Update the local state to reflect the change
      setCourse(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, status: newStatus, updatedAt: new Date().toISOString() } 
            : course
        )
      );
      
      toast.success(`Course ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error("Error updating course status:", error);
      toast.error("Failed to update course status");
    } finally {
      setLoadingCourses(prev => ({ ...prev, [courseId]: false }));
    }
  };
  
  const fetchCourses = async () => {
    try {
      const response = await api.get(`/teachercourseenrollement/enrolled-teacher-courses/${userId}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally{
      setLoading(prev=>({...prev ,courses : false }))
    }
  };
  useEffect(()=>{
    if(!userId){return;}
  
    fetchCourses();

  },)



  const handleManageCourse = async (courseId: string) => {
    setLoadingCourses(prev => ({ ...prev, [courseId]: true }))
    // Simulate loading for demo (replace with actual navigation logic)
    await new Promise(resolve => setTimeout(resolve, 5000))
    setLoadingCourses(prev => ({ ...prev, [courseId]: false }))
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Others Courses</h1>
          <p className="text-muted-foreground">Manage Other teachers  courses</p>
        </div>
       
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search courses..." className="w-full pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="">
      {loading.courses ? (
                              <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                              </div>
                            ) : course.length > 0 ? (
                              <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3  ">
                                {course.map((course) => (
          <Card key={course.id} className="overflow-hidden">
           <CardHeader className="p-0">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/50" />
              </div>
              
              {/* Publish button on the left */}
              <div className="absolute top-2 left-2">
                <Button
                  variant={course.status === 'PUBLISHED' ? 'default' : 'outline'}
                  onClick={() => updateCourseStatus(course.id, course.status)}
                  disabled={loadingCourses[course.id]}
                  size="sm"
                >
                  {loadingCourses[course.id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : course.status === 'PUBLISHED' ? (
                    "Unpublish"
                  ) : (
                    "Publish"
                  )}
                </Button>
              </div>
              
              {/* Dropdown menu on the right */}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Course</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="line-clamp-1 text-xl">
                <Link href={`/dashboard/teacher/courses/${course.id}`} className="hover:underline">
                  {course.title}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-2">{course.description}</CardDescription>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                 <div className="flex flex-col">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="font-medium">{formatRelativeTime(course.updatedAt)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{formatRelativeTime(course.createdAt)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={`/dashboard/teacher/courses/${course.id}`}>
                <Button 
                  onClick={() => handleManageCourse(course.id)}
                  className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
                  disabled={loadingCourses[course.id]}
                >
                  {loadingCourses[course.id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Manage Course"
                  )}
                </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
                              </div>
                            ) : (
                              <div className="rounded-md border border-dashed p-6 text-center">
                                <File className="mx-auto h-8 w-8 text-muted-foreground" />
                                <h3 className="mt-2 font-medium">No course yet</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  There are no Courses to display
                                </p>
                              </div>
                            )}
      </div>

      
    </div>
  )
}

