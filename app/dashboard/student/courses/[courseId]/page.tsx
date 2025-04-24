"use client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, CheckCircle, ChevronLeft, ChevronRight, File, Film, FileText,Trophy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import api from "@/app/utils/axiosInstance"
import Image from "next/image"
import { toast } from "sonner"
import {FileType,CourseMaterial,fileTypeIcons,isMediaFile} from "@/app/utils/fileTypes"
import { formatDuration } from "@/app/utils/functions"
import { QuizWarningModal } from "@/components/quiz-warning-modal"
import { IconLinkWithLoading } from "@/components/icon-link-with-loading"
import { LinkWithLoading } from "@/components/link-with-loading"





export default function CoursePage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const router = useRouter()
  const[userId,setUserId]=useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [quizId, setQuizId] = useState<any>("")
  const [chapters, setChapters] = useState<any[]>([])
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingchapterId, setIsLoadingchapterId] = useState("")
  const [loading, setLoading] = useState({
    course: true,
    chapters: true,
    quizzes: true, 
    materials:true
  })
  const [error, setError] = useState({
    course: null,
    chapters: null,
    quizzes: null,
    materials: null
  })
 

  //fetchIDof User from localstorage
  useEffect(() => {
    const userID = localStorage.getItem("userId"); 
    if (userID) {
      setUserId(userID)
    }
  },[] );


  
 // Fetch course materials
 useEffect(() => {
  if(!courseId){
    return;
  }
  const fetchMaterials = async () => {
    try {
      const response = await api.get(`/coursematerials/course/${courseId}`);
       if(response){
        // Filter out null fileUrls and transform data if needed
      const validMaterials = response.data.filter((material: any) => material.fileUrl !== null).map((material: any) => 
        ({
        ...material,
        fileType: material.fileType || 'UNKNOWN', // Default value
      }));

    setMaterials(validMaterials);
       }else {console.log("error  at response")}
      
      
    } catch (err) {
      console.error(error,err)
      
      toast.error("Error Loading materials", {
        description: "Failed to load lesson materials"
      });
    } finally {
      setLoading(prev => ({...prev, materials: false}));
    }
  };

  fetchMaterials();
}, [courseId]);

  // Fetch course data
  useEffect(() => {
    if(!courseId ||!userId){
      return;
    }
    const fetchCourseInfo = async () => {
      try {
        const response = await api.get(`course/getcourse/${courseId}?userId=${userId}`)
        console.log("this is the reqponse",response)
        console.log("here is resonse dataa:",response.data )
        if(response){
          setCourse(response.data)
         
        }else {console.log("Merde frere erreur la ")}
        console.log("here is the course ",course)
      } catch (err) {
        toast.error("Error Loading courseInfo ",{
          description:"Error Loading the courseInfo on your page"
        })
      } finally {
        setLoading(prev => ({...prev, course: false}))
      }
    }
    fetchCourseInfo()
  }, [courseId,userId])

  // Fetch chapters with progress
  useEffect(() => {
    if(!courseId ||!userId){
      return;
    }
    const fetchChapters = async () => {
      try {
        const response = await api.get(`chapter/courses/${courseId}/chapters?userId=${userId}`
        )
        console.log("Sample of courses gotten by juve:",response.data)
        setChapters(response.data);
      } catch (err) {
        toast.error("Error Loading chapter ",{
          description:"Error Loading the chapters on your page"
        })
      } finally {
        setLoading(prev => ({...prev, chapters: false}))
      }
    }
    fetchChapters()
  }, [courseId,userId])

  // Fetch quizzes
  useEffect(() => {
    if(!courseId){
      return;
    }
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(`quiz/quizzes-publish/by-course/${courseId}`)
        setQuizzes(response.data)
      } catch (err) {
        toast.error("Error Fetching quizzes ",{
          description:"Error Loading the quizzes on your page"
        })
      } finally {
        setLoading(prev => ({...prev, quizzes: false}))
      }
    }
    fetchQuizzes()
  }, [courseId])

  // Handle chapter start/continue
  const handleChapterStart = async (chapterId: string,status:string) => {
    setIsLoadingchapterId(chapterId)
    setIsLoading(true)
    try {
      // Create progress record if it doesn't exist
      if (status=="NOT_STARTED"){
        const response = await api.post('/chapterprogress/create-chapter-progress', {
          userId: localStorage.getItem('userId'),
          chapterId
        })
        if(response){console.log("Chapter progression started")

        }else{
          console.log("failed to start progression")}
      }else{console.log("Already in start")}
     
      router.push(`/dashboard/student/courses/${courseId}/chapters/${chapterId}`)
    } catch (error) {
      console.error('Error starting chapter:', error)
     
    }
  }


  const settingquizId=(quizIdset:string)=>{
   setQuizId(quizIdset)
   setShowWarning(true)

  }
  if (loading.course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error.course || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500">
          {'Failed to load course'}
        </div>
        <IconLinkWithLoading
          href={`/dashboard/student/courses`}
          icon={<ArrowLeft className="h-4 w-4" />}
          srText="Back to courses"
          variant="ghost"
        /> 
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Course Header */}
      <div className="flex items-center gap-4">
      <IconLinkWithLoading
          href={`/dashboard/student/courses`}
          icon={<ArrowLeft className="h-4 w-4" />}
          srText="Back to courses"
          variant="ghost"
        /> 
        <div className="flex-1">
          <div className="flex items-center gap-4">
          <Image
            src={course.teacherPicture || "/noimage.png"}
            alt={`${course.teacherFirstname} ${course.teacherLastname}`}
            width={48}
            height={48}
            className="rounded-full object-cover"
            style={{
              width: 'auto',
              height: 'auto',
            }}
          />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Created by {course.teacherFirstname} {course.teacherLastname}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>Track your progress through this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span>{course.courseprogress}%</span>
            </div>
            <Progress value={course.courseprogress} className="h-2" />
          </div>
          <div className="mt-4 flex justify-end">
            
            <LinkWithLoading 
              href={`/dashboard/student/rankings`} 
              loadingText="Opening Page..." 
              > 
              <Trophy className="mr-2 h-4 w-4" />
              View Rankings
              </LinkWithLoading> 
          </div>
        </CardContent> 
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="resources">Documents</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        {/* Course Content Tab */}
        <TabsContent value="content" className="mt-4">
          {loading.chapters ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error.chapters ? (
            <div className="text-red-500 text-center py-4">
              Failed to load chapters
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.length === 0 ? (
                  <p className="text-muted-foreground text-center">No Chapters available yet.</p>
                ) : (chapters.sort((a, b) => a.order - b.order).map((chapter) => (
                <Card key={chapter.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{`Chapter ${chapter.order}`}</Badge>
                        <CardTitle className="text-lg">{chapter.title}</CardTitle>
                        {chapter.status === 'COMPLETED' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    <CardDescription>{chapter.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Chapter Progress</span>
                          <span>{chapter.progress}%</span>
                        </div>
                        <Progress value={chapter.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {chapter.lessons} {chapter.lessons === 1 ? "lesson" : "lessons"}
                        </div>
                      
                        <Button
                        onClick={() => handleChapterStart(chapter.id,chapter.status)}
                        disabled={isLoadingchapterId===chapter.id}
                      >
                        {isLoadingchapterId===chapter.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <> {chapter.status === 'NOT_STARTED' 
                            ? 'Start Chapter'
                            : chapter.status === 'IN_PROGRESS'
                            ? 'Continue Chapter'
                            : 'View Chapter'}
                        <ChevronRight className="ml-2 h-4 w-4" /></>
                        )}
                      </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )))}
            </div>
          )}
        </TabsContent>

        {/* Resources Tab */}
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
                            <p className="font-medium">{material.fileName || 'Untitled Resource'}</p>
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
           
          </Card>
        </TabsContent>

        {/* Quizzes Tab */}
        <TabsContent value="quizzes" className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Take a quiz of your choice, dear student.
          </p>

          {loading.quizzes ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error.quizzes ? (
            <div className="text-red-500 text-center py-4">
              Failed to load quizzes
            </div>
          ) : (
            quizzes.map((quiz: any, index: any) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {quiz.title || "Untitled Quiz"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {quiz.description || "No description available."}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>{quiz.quizcategorie} questions</span>
                    <span>Created {new Date(quiz.createdAt).toLocaleDateString()}</span>
                    <span>Duration:{formatDuration(quiz.duration)} mins</span>
                  </div>
                </div>
 
                  <Button onClick={() => settingquizId(quiz.id)}>
                    Try the quiz
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <QuizWarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        onStartQuiz={() => {
          window.location.href = `/dashboard/student/courses/${courseId}/quizzes/${quizId}`
        }}
      />
    </div>
  )
}