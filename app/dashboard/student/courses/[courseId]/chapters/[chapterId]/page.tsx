"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, BookOpen, CheckCircle, ChevronLeft, ChevronRight, Clock, Download, FileText, Info, Loader2, Upload,File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import api from "@/app/utils/axiosInstance"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import {FileType,CourseMaterial,fileTypeIcons,isMediaFile} from "@/app/utils/fileTypes"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {formatDuration} from "@/app/utils/functions"


export default function ChapterPage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const router = useRouter()
  const [chapter, setChapter] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const[userId,setUserId]=useState('')
  const [assignments, setAssignments] = useState<any[]>([])
  const [assignmentsubmission, setAssignmentsubmission] = useState<any>()
  const [assignmentId,setAssignmentId]=useState<any>("")
  const [isUploading, setIsUploading] = useState(false)
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [loading, setLoading] = useState({
    chapter: true,
    lessons: true,
    assignments: true,
    materials:true
  })
  const [error, setError] = useState({
    chapter: null,
    lessons: null,
    assignments: null,
    materials:null
  })


  
   //fetchIDof User from localstorage
   useEffect(() => {
    const userID = localStorage.getItem("userId"); 
    console.log("HERE IS ",userID)
    if (userID) {
      console.log(userID)
      setUserId(userID)
    }
  },[] );


  // Fetch chapter data
  useEffect(() => {
    if(!chapterId){
      return;
    }
    const fetchChapterInfo = async () => {
      try {
        const response = await api.get(`/chapter/${chapterId}/chapter`)
        setChapter(response.data)
      } catch (err) {
        toast.error("Error Loading chapter info", {
          description: "Failed to load chapter information"
        })
        
      } finally {
        setLoading(prev => ({...prev, chapter: false}))
      }
    }
    fetchChapterInfo()
  }, [chapterId])


  // Fetch lessons with progress
  useEffect(() => {

    if(!chapterId || !userId){
      return;
    }

    const fetchLessons = async () => {
      try {
        const response = await api.get(`/lesson/chapters/${chapterId}/lessons?userId=${userId}`)
        const lessonsWithProgress = response.data.map((lesson: any) => {
          // Safely check for progresses array
          const hasProgress = Array.isArray(lesson.progresses) && 
                            lesson.progresses.length > 0 &&
                            lesson.progresses[0] !== null;
          
          return {
            ...lesson,
            completed: hasProgress ? lesson.progresses[0].status : 'NOT_STARTED',
            progress: hasProgress ? lesson.progresses[0].progress : 0
          };
        });
  
        setLessons(lessonsWithProgress);
      } catch (err) {
        toast.error("Error Loading lessons", {
          description: "Failed to load lessons for this chapter"
        })
       
      } finally {
        setLoading(prev => ({...prev, lessons: false}))
      }
    }
    fetchLessons()
  }, [chapterId,userId])

  // Fetch assignments in a chapter
  useEffect(() => {

    if(!chapterId||!userId){
      return;
    }

    const fetchAssignments = async () => {
      try {
        const response = await api.get(`/assignment/chapters/${chapterId}/assignment/${userId}`)
        setAssignments(response.data)
        console.log("Look for the id here huio:",response.data)
        setAssignmentId(response.data.id)
      } catch (err) {
        toast.error("Error Loading assignments", {
          description: "Failed to load assignments for this chapter"
        })

         toast.error("Error LoadingAssignments ",{
          description:"Error Loading the assignments on your page"})

      } finally {
        setLoading(prev => ({...prev, assignments: false}))
      }
    }
    fetchAssignments()
  }, [chapterId,userId])

 // Fetch chapter materials
 useEffect(() => {
  if(!chapterId){
    return;
  }
  const fetchMaterials = async () => {
    try {
      const response = await api.get(`/coursematerials/chapter/${chapterId}`);
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
      console.log("here is the error:" ,err,"and this also:",error )
      toast.error("Error Loading materials", {
        description: "Failed to load chapter materials"
      });
    } finally {
      setLoading(prev => ({...prev, materials: false}));
    }
  };

  fetchMaterials();
}, [chapterId]);



// Handle submission creation
const handleAssignmentSubmit = async (e: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
  if (!e.target.files || !e.target.files[0] || !userId) return;
  
  const file = e.target.files[0];
  const MAX_FILE_SIZE_MB = 60;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  // File size validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
    return;
  }

  setIsUploading(true);
  
  try {
    // 1. Upload the file to UploadThing
    const formData = new FormData();
    formData.append("file", file);
    
    const uploadResponse = await api.post("/uploadthing/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (!uploadResponse.data?.uploadFile?.[0]?.data?.ufsUrl) {
      throw new Error("File upload failed");
    }

    const fileUrl = uploadResponse.data.uploadFile[0].data.ufsUrl;
    const fileName = uploadResponse.data.uploadFile[0].data.name;
    const fileType = fileName.split('.').pop()?.toUpperCase();

    

    // 2. Check if submission exists
    let submission;
    try {
      const existingSubmission = await api.get(
        `/assignmentsubs/assignments/${assignmentId}/submissions/${userId}`
      );
      
      if(existingSubmission.status==203){
        submission = await api.post(
          `/assignmentsubs/assignments/${assignmentId}/submissions`,
          {
            userId: userId,
            fileUrl,
            fileName,
            filetype:fileType,
            status: "SUBMITTED"
          }
          
        );
        if(submission){console.log("post ok for submittion creation")}
      }else if(existingSubmission.status==201){
        console.log("Here are 3 elements before put:",fileName,fileType,fileUrl)
        submission = await api.put(
          `/assignmentsubs/assignments/${assignmentId}/submissions/${userId}`,
          {
            fileUrl,
            fileName,
            filetype:fileType
          }
        );
      }
      
    } catch (error) {
      toast.error("Error submitting file",{
        description:'An error went on please try later or signal an admin'
      })
    }

    toast.success("Assignment submitted successfully!");
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(
      error instanceof Error 
        ? error.message 
        : "Assignment submission failed. Please try again."
    );
  } finally {
    setIsUploading(false);
  }
};




  // Handle lesson start/continue
  const handleLessonStart = async (lessonId: string, completed: string) => {

    if(!userId){
      return;
    }

    try {
      // Create progress record if it doesn't exist
      if (completed=='NOT_STARTED') {
        const response = await api.post('/lessonprogress/create-lesson-progress', {
          userId,
          lessonId
        })
        if (response) {
          console.log("Lesson progression started")
        } else {
          console.log("Failed to start lesson progression")
        }
      }
      
      router.push(`/dashboard/student/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`)
    } catch (error) {
      console.error('Error starting lesson:', error)
      toast.error("Error starting lesson", {
        description: "There was an issue starting the lesson"
      })
    }
  }



  if (loading.chapter) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error.chapter || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-500">
          Failed to load chapter
        </div>
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/student/courses/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to course</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{chapter.title}</h1>
          <p className="text-muted-foreground">
            {chapter.description} • Chapter {chapter.order}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Chapter Progress</CardTitle>
          <CardDescription>Track your progress through this chapter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{chapter.progresses[0].progress}%</span>
            </div>
            <Progress value={chapter.progresses[0].progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="ressource">Documents</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Lessons</CardTitle>
              <CardDescription>Complete all lessons to finish this chapter</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.lessons ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error.lessons ? (
                <div className="text-red-500 text-center py-4">
                  Failed to load lessons
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Lesson {lesson.order}</Badge>
                            <p className="font-medium">{lesson.title}</p>
                            {lesson.completed==="COMPLETED" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(lesson.duration)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleLessonStart(lesson.id, lesson.completed)}
                      >
                        {lesson.completed === 'NOT_STARTED' 
                            ? 'Start Lesson'
                            : lesson.completed === 'IN_PROGRESS'
                            ? 'Continue Lesson'
                            : 'View Lesson'}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ressource" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Resources</CardTitle>
              <CardDescription>Additional materials for this Chapter</CardDescription>
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
                            <p className="font-medium">{material.fileUrl?.split('/').pop() || 'Untitled Resource'}</p>
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


        <TabsContent value="assignments" className="mt-4">
  <Card>
    <CardHeader>
      <CardTitle>Chapter Assignments</CardTitle>
      <CardDescription>Complete assignments to demonstrate your understanding</CardDescription>
    </CardHeader>
    <CardContent>
      {loading.assignments ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error.assignments ? (
        <div className="text-center py-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error loading assignments</AlertTitle>
            <AlertDescription>
              Failed to load assignments. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      ) : assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const fileExtension = assignment.fileType?.toUpperCase() || 
                                assignment.fileName?.split('.').pop()?.toUpperCase();
            const FileIcon = fileExtension ? fileTypeIcons[fileExtension as keyof typeof fileTypeIcons] : FileText;
            const IconComponent = FileIcon || FileText;
            const hasSubmission = assignment.submission?.fileUrl;

            return (
              <div key={assignment.id} className="flex flex-col rounded-lg border p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {assignment.description}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      assignment.submission?.status === "GRADED" ? "default" :
                      assignment.submission?.status === "SUBMITTED" ? "secondary" : "outline"
                    }
                    className="ml-2"
                  >
                    {assignment.submission?.status === "GRADED" ? "Graded" :
                     assignment.submission?.status === "SUBMITTED" ? "Submitted" : "Not Submitted"}
                  </Badge>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Max Score:</span>
                    <span>{assignment.maxScore} points</span>
                  </div>
                </div>

                {/* Teacher's Assignment File (if any) */}
                {assignment.fileUrl && (
                  <div className="mt-3 p-3 bg-muted/10 rounded-md">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Assignment File: {assignment.fileName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="bg-background px-2 py-1 rounded-full">
                            {fileExtension}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => window.open(assignment.fileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Student's Submission Details */}
                {hasSubmission && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Your Submission: {assignment.submission.fileName}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="bg-background px-2 py-1 rounded-full">
                            {assignment.submission.filetype?.toUpperCase()}
                          </span>
                          <span>
                            Submitted on {new Date(assignment.submission.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => window.open(assignment.submission.fileUrl, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    {assignment.submission.grade && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-medium">Grade:</span>
                        <span>
                          {assignment.submission.grade}/{assignment.maxScore}
                        </span>
                        {assignment.submission.feedback && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{assignment.submission.feedback}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Submission Actions */}
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button asChild variant={hasSubmission ? "outline" : "default"}>
                    <label 
                      htmlFor={`submission-upload-${assignment.id}`}
                      className="cursor-pointer"
                    >
                      {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {hasSubmission ? "Update Submission" : "Submit Assignment"}
                      <input
                        id={`submission-upload-${assignment.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleAssignmentSubmit(e, assignment.id)}
                        disabled={isUploading}
                      />
                    </label>
                  </Button>

                  {assignment.submission?.status === "GRADED" && (
                    <Link
                      href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}`}
                    >
                      <Button variant="secondary" className="w-full sm:w-auto">
                        <FileText className="mr-2 h-4 w-4" />
                        View Feedback
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-6 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 font-medium">No assignments yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            There are no assignments for this chapter yet
          </p>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
      </Tabs>
    </div>
  )
}