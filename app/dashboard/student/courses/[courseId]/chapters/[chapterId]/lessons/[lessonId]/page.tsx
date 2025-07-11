"use client"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle, ChevronLeft, ChevronRight, File, Film, FileText, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import api from "@/app/utils/axiosInstance"
import { useParams } from "next/navigation"
import {FileType,CourseMaterial,fileTypeIcons,isMediaFile} from "@/app/utils/fileTypes"
import {formatDuration} from "@/app/utils/functions"




export default function LessonPage() {
  const { courseId, chapterId,lessonId } = useParams() as { courseId: string; chapterId: string; lessonId: string }
  let DOMPurify;
  if (typeof window !== 'undefined') {
    DOMPurify = require('dompurify');
  }
 
 
  const [lesson, setLesson] = useState<any>(null)
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const[userId,setUserId]=useState('')
  const [loading, setLoading] = useState({
    lesson: true,
    materials: true
  })
  const [error, setError] = useState({
    lesson: null,
    materials: null
  })
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

    //fetchIDof User from localstorage
    useEffect(() => {
      const userID = localStorage.getItem("userId"); 
      if (userID) {
        setUserId(userID)
      }
    },[] );


//to refresh user progression in case a lesson is added after 
useEffect(()=>{
  if(!userId ||!lessonId ||!chapterId || !courseId){return;}
 const updateprogresses= async ()=>{
  console.log("here we update")
  const response = await api.put(`/lessonprogress/lessoncreation-progress-update/${lessonId}`, {
    userId: userId,
    chapterId:chapterId,
    courseId:courseId
  }) 
  if(response){console.log("the update was well done ")}
 }
 updateprogresses()
},[userId,lessonId,chapterId,courseId])



  // Fetch lesson data
  useEffect(() => {
    if(!lessonId ||!userId){
      return;
    }
    const fetchLesson = async () => {
      try {
        const response = await api.get(`/lesson/lessons/${lessonId}?userId=${userId}`)
        console.log("here is data for us to fix prob:",response.data)
        setLesson(response.data)
        setIsCompleted(response.data.lessonstatus === 'COMPLETED')
       
      } catch (err) {
        toast.error("Error Loading lesson", {
          description: "Failed to load lesson content"
        })
       
      } finally {
        setLoading(prev => ({...prev, lesson: false}))
      }
    }
    fetchLesson()
  }, [lessonId,userId])

  // Fetch lesson materials
  useEffect(() => {
    if(!lessonId){
      return;
    }
    const fetchMaterials = async () => {
      try {
        const response = await api.get(`/coursematerials/lesson/${lessonId}`);
         if(response){
          // Filter out null fileUrls and transform data if needed
        const validMaterials = response.data.filter((material: any) => material.fileUrl !== null).map((material: any) => 
          ({
          ...material,
          fileType: material.fileType || 'UNKNOWN', 
        }));

      setMaterials(validMaterials);
         }else {console.log("error juve at response")}
        
        
      } catch (err) {
        console.error(error,err)
        console.log("here is the error:" ,err,"and this also:",error )
        toast.error("Error Loading materials", {
          description: "Failed to load lesson materials"
        });
      } finally {
        setLoading(prev => ({...prev, materials: false}));
      }
    };
  
    fetchMaterials();
  }, [lessonId]);

  const handleMarkComplete = async () => {
    try {
      setIsLoading(true)
    
      // Update progress to completed
      const response = await api.put(`/lessonprogress/lesson-progress-update/${lessonId}`, {
        userId: userId,
        chapterId:chapterId,
        courseId:courseId
      })

      if (response.data) {
        setIsCompleted(true)
        
        toast.success("Lesson completed", {
          description: "Your progress has been saved."
        })
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error)
      toast.error("Error completing lesson", {
        description: "There was an issue saving your progress"
      })
    }
  }


  if (loading.lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error.lesson || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500">
          Failed to load lesson
        </div>
        <Link href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}`}>
          <Button variant="outline">Back to chapter</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to chapter</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{lesson.title}</h1>
          <p className="text-muted-foreground">Chapter: {lesson.lessonchapter}</p>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Lesson Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle>Lesson Content</CardTitle>
                {isCompleted && (
                  <Badge variant="outline" className="text-green-500 border-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Completed in {formatDuration(lesson.lessontimespenttofinish)}
                  </Badge>
                )}
              </div>
              <CardDescription>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4" />
                  <span>{formatDuration(lesson.duration)} minute</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
              <div className="space-y-4">
              <div 
            className="prose max-w-none" 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify?.sanitize(lesson.html || '<p>No content available</p>') || 
                      (lesson.html || '<p>No content available</p>')
            }} 
          />
              </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Resources</CardTitle>
              <CardDescription>Additional materials for this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.materials ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error.materials ? (
                <div className="text-red-500 text-center py-4">
                  Failed to load materials
                </div>
              ) : materials.length > 0 ? (
                <div className="space-y-4">
                  {materials.map((material) => {
                     const FileIcon = material.fileType ? fileTypeIcons[material.fileType] : File
                     const IconComponent = FileIcon || FileText;
                    return (
                      <div key={material.id} className="flex items-center justify-between rounded-md border p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <IconComponent className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{material.fileName|| 'Untitled Resource'}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {material.fileType?.toLowerCase()} • {new Date(material.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline">
                            View
                          </Button>
                        </a>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <File className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No resources yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    There are no additional resources for this lesson
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {/*<div>
                {lesson.prevLessonId ? (
                  <Link
                    href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.prevLessonId}`}
                  >
                    <Button variant="outline">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous Lesson
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                )}
              </div>*/}
              <div className="flex gap-2">
                {!isCompleted && (
                  
                   <Button  onClick={handleMarkComplete} disabled={isLoading}>
                   {isLoading ? (
                     <>
                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       Proceding...
                     </>
                   ) : (
                     <>
                       <Save className="mr-2 h-4 w-4" />
                       Mark as Complete
                     </>
                   )}
                 </Button>  
                )}
                {/*{lesson.nextLessonId  && (
                  <Link
                    href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.nextLessonId}`}
                  >
                    <Button>
                      Next Lesson
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )} */}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}