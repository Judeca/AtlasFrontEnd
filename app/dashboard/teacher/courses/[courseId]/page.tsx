"use client"

import { useState,useEffect } from "react"

import api from "@/app/utils/axiosInstance"

import Link from "next/link"
import { ArrowLeft, ChevronRight, FolderPlus, Pencil, Trash2, FileText, HelpCircle, Upload,File } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateChapterModal } from "@/components/create-chapter-modal"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import {FileType,CourseMaterial,fileTypeIcons, isMediaFile} from "@/app/utils/fileTypes"
import { toast } from "sonner"

export default function CoursePage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const [isCreateChapterModalOpen, setIsCreateChapterModalOpen] = useState(false)


  const [courses,setCourse]=useState<any>(null)
  const [chapters,setChapters]=useState<any[]>([])
  const [quizze,setQuizzes]=useState<any[]>([])
  const [students,setStudents]=useState<any[]>([])
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [isUploading, setIsUploading] = useState(false)


  const [loading, setLoading] = useState({
    chapter: true,
    lessons: true,
    assignments: true,
    materials:true,
    quizzes:true
  })
  const [error, setError] = useState({
    lesson: null,
    materials: null,
    chapter:null,
    quizzes:null
  })



 //fetch course Info
 useEffect(()=>{
  if(!courseId){
    return;
  }
  const fetchCourse = async () => {
    try {
      const response = await api.get(`/course/getcourse-only/${courseId}`);
      console.log("course Info data :",response.data)
      setCourse(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }
  };

  fetchCourse();

},[])


  //fetch chapters in a course
  useEffect(()=>{
    if(!courseId){
      return;
    }
    const fetchChapters = async () => {
      try {
        const response = await api.get(`/chapter/courses/${courseId}/chapters`);
        setChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(prev => ({...prev, chapter: false}));
      }
    };

    fetchChapters();

  },[])


  //fetch quizzes in a course
  useEffect(()=>{
    if(!courseId){
      return;
    }
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(`/quiz/quizzes/by-course/${courseId}`);
        setQuizzes(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }finally {
        setLoading(prev => ({...prev, quizzes: false}));
      }
    };

    fetchQuizzes();

  },[])


  //fetch student enrol in a course
  useEffect(()=>{
    if(!courseId){
      return;
    }
    const fetchStudents = async () => {
      try {
        const response = await api.get(`/courseenrollement/courses/${courseId}/enrollments`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
      }
    };

    fetchStudents();

  },[])


  // Fetch course materials
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
       }else {console.log("error juve at response")}
      
      
    } catch (err) {
      console.error(error,err)
      console.log("here is the error:" ,err,"and this also:",error )
      toast.error("Error Loading materials", {
        description: "Failed to load course materials"
      });
    } finally {
      setLoading(prev => ({...prev, materials: false}));
    }
  };

useEffect(() => {
  if(!courseId){
    return;
  }
  fetchMaterials();
}, [courseId]);


//file upload

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || !e.target.files[0]) return;
  
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
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", courseId);

    // Determine file type and select appropriate upload endpoint
     const isMediaFiletrue = isMediaFile(file);
    console.log("Here is Media file",isMediaFiletrue)
    const uploadEndpoint = isMediaFiletrue ? '/coursematerials/upload'  :'/uploadthing/api/uploadcreate' ;

    // Upload to appropriate service
    const response = await api.post(uploadEndpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });

    if (response.data.error) {
      throw new Error(response.data.error);
    }

    toast.success(` uploaded successfully`);
    fetchMaterials();
    
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(
      error instanceof Error 
        ? error.message 
        : "File upload failed. Please try again."
    );
  } finally {
    setIsUploading(false);
  }
};


 

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/teacher/courses">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to courses</span>
          </Button>
        </Link>
        <div>
        {courses && ( 
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{courses.title}</h1>
          <p className="text-muted-foreground">{courses.description}</p>
        </div>
      )}
        </div>
      </div>

      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="materials">Documents</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Course Chapters</h2>
            <Button onClick={() => setIsCreateChapterModalOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Add Chapter
            </Button>
          </div>

          <div className="space-y-4">
          {loading.chapter ? (
                              <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                              </div>
                            ) : error.chapter ? (
                              <div className="text-red-500 text-center py-4">
                                Failed to load chapters
                              </div>
                            ) : chapters.length > 0 ? (
                              <div className="space-y-4">
                                {chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{`Chapter ${chapter.order}`}</Badge>
                      <CardTitle className="text-lg">{chapter.title}</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit Chapter</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Chapter
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Add Assignment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Chapter
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{chapter.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {chapter.lessonCount} {chapter.lessonsCount === 1 ? "lesson" : "lessons"}
                    </div>
                    <Link href={`/dashboard/teacher/courses/${courseId}/chapters/${chapter.id}`}>
                      <Button>
                        View Lessons
                        <ChevronRight className="ml-2 h-4 w-4" />
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
                                <h3 className="mt-2 font-medium">No chapter yet</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  There are no chapters for this course
                                </p>
                              </div>
                            )}
          </div>
        </TabsContent>
        <TabsContent value="materials" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lesson Materials</CardTitle>
               
              </div>
              <div className="relative">
                <Button asChild>
                  <label htmlFor="material-upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Material
                    <input
                      id="material-upload"
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isUploading ? (
                <div className="flex items-center justify-center p-8">
                  <p>Uploading file...</p>
                </div>
              ) : materials.length === 0 ? (
                <div className="rounded-md border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No materials added yet. Upload your first material.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Placeholder for materials list */}
                  <div className="border rounded-md p-3">
                    <p>Materials list would appear here</p>
                  </div>
                </div>
              )}

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
        <TabsContent value="quizzes" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Course Quizzes</h2>
            <Link href={`/dashboard/teacher/courses/${courseId}/quizzes/create`}>
              <Button>
                <HelpCircle className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
          {loading.quizzes ? (
                              <div className="flex items-center justify-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                              </div>
                            ) : error.quizzes ? (
                              <div className="text-red-500 text-center py-4">
                                Failed to load quizzes
                              </div>
                            ) : quizze.length > 0 ? (
                              <div className="space-y-4">
                                {quizze.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <Badge variant={quiz.status === "PUBLISHED" ? "default" : "secondary"}>
                        {quiz.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT"}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit Quiz</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Quiz
                        </DropdownMenuItem>
                        {quiz.status === "DRAFT" && (
                          <DropdownMenuItem>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            Publish Quiz
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Quiz
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/*<CardDescription>{quiz.description}</CardDescription>*/}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{quiz.quizcategorie} questions</span>
                      <span>Created {quiz.createdAt}</span>
                    </div>
                    <Link href={`/dashboard/teacher/courses/${courseId}/quizzes/${quiz.id}`}>
                      <Button>
                        View Quiz
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/teacher/courses/${courseId}/quizzes/${quiz.id}/edit`}>
                      <Button>
                        Add Questions
                        <ChevronRight className="ml-2 h-4 w-4" />
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
                                <h3 className="mt-2 font-medium">No Quizzes yet</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  There are no additional quizzes for this lesson
                                </p>
                              </div>
                            )}
          </div>
        </TabsContent>


        <TabsContent value="students" className="mt-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Enrolled Students</h2>
            <div className="flex gap-2">
              <Link href={`/dashboard/teacher/courses/${courseId}/rankings`}>
                <Button variant="outline">View Rankings</Button>
              </Link>
              <Button variant="outline">Export List</Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage students enrolled in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <span className="text-xs font-medium">⭐</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium"> {student.student.firstName}{student.student.lastName}</p>
                        <p className="text-xs text-muted-foreground">{student.student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/*<Badge variant={i % 2 === 0 ? "default" : "outline"}>{i % 2 === 0 ? "Active" : "Inactive"}</Badge>*/}
                      <Button variant="ghost" size="sm">
                        View Progress
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>Manage your course settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">These actions cannot be undone</p>
                  <div className="flex items-center justify-between rounded-md border border-destructive/20 p-4">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Course</h4>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete the course and all its content
                      </p>
                    </div>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateChapterModal
        courseId={courseId}
        isOpen={isCreateChapterModalOpen}
        onClose={() => setIsCreateChapterModalOpen(false)}
      />
      

    </div>
  )
}

