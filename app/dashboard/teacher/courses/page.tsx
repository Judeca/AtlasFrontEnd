"use client"

import { useState,useEffect } from "react"
import api from "@/app/utils/axiosInstance"
import Link from "next/link"
import { BookOpen, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CreateCourseModal } from "@/components/create-course-modal"
import { formatRelativeTime } from "@/app/utils/functions"

export default function TeacherCoursesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [course ,setCourse]=useState<any[]>([]);
  const [userId,setUserId]=useState('')


 

  useEffect(() => {
    const userID = localStorage.getItem("userId"); 
    console.log("HERE IS ",userID)
    if (userID) {
      console.log(userID)
      setUserId(userID)
    }
  },[userId] );


  if(!userId)return;
  const fetchCourses = async () => {
    try {
      const response = await api.get(`/course/teacher-courses/${userId}`);
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };
  useEffect(()=>{
  
    fetchCourses();

  },)

  const handleCourseCreated = () => {
    // Your refresh logic here
    console.log("Assignment created successfully, refresh data");
    fetchCourses(); // Example refresh function
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">Manage and create your courses</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search courses..." className="w-full pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {course.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                </div>
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
                {/*<div className="flex flex-col">
                  <span className="text-muted-foreground">Chapters</span>
                  <span className="font-medium">{course.chaptersCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Lessons</span>
                  <span className="font-medium">{course.lessonsCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">{course.studentsCount}</span>
                </div> */}
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
                  <Button variant="outline" size="sm">
                    Manage Course
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateCourseModal 
      isOpen={isCreateModalOpen} 
      onClose={() => setIsCreateModalOpen(false)} 
      onSuccess={()=>handleCourseCreated()}
      userId={userId} />
    </div>
  )
}

