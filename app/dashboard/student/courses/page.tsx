"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Search } from "lucide-react"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import api from "@/app/utils/axiosInstance"


export default function StudentCoursesPage() {

  const router=useRouter()
  const [courses ,setCourses]=useState<any>([])
  const [courseavailable ,setCourseavailable]=useState<any[]>([]);
  const [userId,setUserId]=useState<any>("")
  
  
  useEffect(() => {
    const userID = localStorage.getItem("userId"); 
    console.log("HERE IS ",userID)
    if (userID) {
      console.log(userID)
      setUserId(userID)
    }
  },[userId] );
  
  
  useEffect(()=>{
    if(!userId){
      return;
    }
    const fetchCoursesavailable = async () => {
      try {
        const response = await api.get(`/course/get-unenrolled-courses/${userId}`);
        const courseAvailableWithProgress=response.data.map((course:any)=>({
          ...course,
          status: course.progresses[0]?.status || 'NOT_STARTED',
          progress: course.progresses[0]?.progress || 0

        }))
        setCourseavailable(courseAvailableWithProgress);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchCoursesavailable();

  },[userId])
  
 
  
  useEffect(()=>{
    if(!userId){
      return;
    }
    const fetchcourses= async ()=>{
    try{
      const response =await api.get (`/courseenrollement/courses/enrolled/${userId}`)
      console.log(response.data)
      setCourses(response.data)  
    } catch(error) {
      console.error("Error fetching courses:", error);
    }
    }
    fetchcourses()
  },[userId])


  const handleCourseStart= async (courseId:string,coursestatus:string)=>{

    try{
      if (coursestatus=='NOT_STARTED') {
      const response =await api.post (`/courseenrollement/create-enrollments`,{
        courseId:courseId,
        studentId:userId
      })

      if (response){
        console.log(response.data)
        try{
          const responses =await api.post (`/courseprogress/create-course-progress`,{
            courseId:courseId,
            userId:userId
          },)
          if (responses){
            console.log("good creation of course progress")
            router.push(`/dashboard/student/courses/${courseId}`)
          }else{console.log("bad creation of course progress")}

        }catch(error){
          console.error("Error creating course progresse courses:", error);
        }
      }else{
        console.log("failede enrolement")}
      
      }else {console.log("Failed to enrol and to create course Progresse")}
    } catch(error) {
      console.error("Error fetching courses:", error);
    }


  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">View your enrolled courses and discover new ones</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search courses..." className="w-full pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
          <TabsTrigger value="available">Available Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="enrolled" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.length === 0 ? (
                  <p className="text-muted-foreground text-center">No courses enrolled yet.</p>
                ) : ( courses.map((course:any,index:any) => (
              <Card key={course.course.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1 text-xl">
                    <Link href={`/dashboard/student/courses/${course.course.id}`} className="hover:underline">
                      {course.course.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{course.course.description}</CardDescription>
                  <div className="mt-4 text-sm">
                    <p className="text-muted-foreground">Instructor: {course.course.teacher.firstName}</p>
                    {/*<div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>*/}
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Chapters</span>
                      <span className="font-medium">{course.chapterCount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Lessons</span>
                      <span className="font-medium">{course.lessonsCount}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/dashboard/student/courses/${course.course.id}`}>
                      <Button size="sm">Continue Learning</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )))}
          </div>
        </TabsContent>
        <TabsContent value="available" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courseavailable.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1 text-xl">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{course.description}</CardDescription>
                  {/*<div className="mt-4 text-sm">
                    <p className="text-muted-foreground">Instructor: {course.teacher}</p>
                  </div>
                  <div className="mt-4 flex justify-between text-sm">
                    <div className="flex flex-col">
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
                    </div>
                  </div>*/}
                  <div className="mt-4 flex justify-end">
        
                      <Button size="sm" onClick={() => handleCourseStart(course.id,course.status)}>Enroll Now</Button>
                    
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

