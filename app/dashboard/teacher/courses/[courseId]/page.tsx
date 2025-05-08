"use client"

import { useState,useEffect } from "react"
import { useSocket } from '@/app/context/SocketContext';
import api from "@/app/utils/axiosInstance"

import Link from "next/link"
import { ArrowLeft, ChevronRight, FolderPlus, Pencil, Trash2, FileText, HelpCircle, Upload,File, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateChapterModal } from "@/components/create-chapter-modal"
import { CreateQuizModal } from "@/components/create-quiz-modal"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import {FileType,CourseMaterial,fileTypeIcons, isMediaFile} from "@/app/utils/fileTypes"
import { toast } from "sonner"
import { formatDuration, formatRelativeTime } from "@/app/utils/functions"
import { IconLinkWithLoading } from "@/components/icon-link-with-loading"
import { LinkWithLoading } from "@/components/link-with-loading"
import AnimatedUpload from "@/components/AnimatedLoading"
import { OnlineIndicator } from "@/app/components/OnlineIndicator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CoursePage() {
  const { socket } = useSocket();
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const [isCreateChapterModalOpen, setIsCreateChapterModalOpen] = useState(false)
  const [isCreateQuizModalOpen, setIsCreateQUizModalOpen] = useState(false)

  const [courses,setCourse]=useState<any>(null)
  const [chapters,setChapters]=useState<any[]>([])
  const [quizze,setQuizzes]=useState<any[]>([])
  const [students,setStudents]=useState<any[]>([])
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [userId,setUserId]=useState("")
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [courseTeachers, setCourseTeachers] = useState<any[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<any | null>(null);

  const [loading, setLoading] = useState({
    chapter: false,
    lessons: true,
    assignments: true,
    materials:true,
    courseTeachers: false,
    quizzes:false,
    deleting: false
  })

  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [isLoadingquizzes, setIsLoadingquizzes] = useState(true);
  const [isLoadingmaterials, setIsLoadingmaterials] = useState(true);
  const [isLoadingcourseTeacher, setIsLoadingcourseTeacher] = useState(true);

  
  const [error, setError] = useState({
    lesson: null,
    materials: null,
    chapter:null,
    quizzes:null
  })
 
  useEffect(() => { 
    const userID = localStorage.getItem("userId");   
    if (userID) { 
    setUserId(userID) 
    } 
    },[userId] ); 



    //fetch all teachers
    useEffect(() => {
      const fetchTeachers = async () => {
        try {
          const response = await api.get('/users/Allteachers');
          setTeachers(response.data);
        } catch (error) {
          toast.error('Failed to load teachers');
        } finally {
          setIsLoadingTeachers(false);
        }
      };
      fetchTeachers();
    }, []);

     //fetch only enroll teachers
     const fetchenrolTeachers = async () => {
      try {
        const response = await api.get(`/teachercourseenrollement/teachers-enrol/${courseId}`);
        setCourseTeachers(response.data);
      } catch (error) {
        toast.error('Failed to load teachers');
      } finally {
        setIsLoadingcourseTeacher(false)
      }
    };
     useEffect(() => {
      
      fetchenrolTeachers();
    }, []);

    const handleDeleteTeacher = async () => {
      if (!teacherToDelete?.id) return;
      
      setLoading({ ...loading, deleting: true });
      try {
        const response = await api.delete(`/teachercourseenrollement/enrollments/delete-teacher/${teacherToDelete.teacherId}/${courseId}`)
        
        // Refresh course teachers
        const res = await api.get(`/teachercourseenrollement/teachers-enrol/${courseId}`);
        setCourseTeachers(res.data);
        toast.success('Teacher removed successfully');
      } catch (error) {
        toast.error('Failed to remove teacher');
      } finally {
        setTeacherToDelete(null);
        setLoading({ ...loading, deleting: false });
      }
    };

    //Add teacher
    const handleAddTeacher = async () => {
      if (!selectedTeacherId || !courseId) return;
      const teacherdata={
        teacherId: selectedTeacherId,
            courseId,
            role: 'AUDITOR' 
      }
      
      setIsAddingTeacher(true);
      try {
        const response = await api.post('/teachercourseenrollement/enrollments/teacher', teacherdata);
        
        toast.success('Teacher added successfully');
        setSelectedTeacherId(''); // Reset selection
        fetchenrolTeachers();
      } catch (error) {
        toast.error('Failed to add teacher');
      } finally {
        setIsAddingTeacher(false);
      }
    };
 //fetch course Info

 const fetchCourse = async () => {
  try {
    const response = await api.get(`/course/getcourse-only/${courseId}`);
    setCourse(response.data);
  } catch (error) {
    console.error("Error fetching chapters:", error);
  }
};



 useEffect(()=>{
  if(!courseId){
    return;
  }
  fetchCourse();

},[])


  //fetch chapters in a course
  const fetchChapters = async () => {
    try {
      const response = await api.get(`/chapter/courses/${courseId}/chapters`);
      setChapters(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    } finally {
      setIsLoadingChapters(false);
    }
  };

  useEffect(()=>{
    if(!courseId){
      return;
    }
    fetchChapters();

  },[])


  //fetch quizzes in a course
  const fetchQuizzes = async () => {
    try {
      const response = await api.get(`/quiz/quizzes/by-course/${courseId}`);
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching chapters:", error);
    }finally {
      setIsLoadingquizzes(false)
    }
  };
  useEffect(()=>{
    if(!courseId){
      return;
    }
    fetchQuizzes();

  },[])


  //fetch student enrol in a course
  const fetchStudents = async () => {
    try {
      const response = await api.get(`/courseenrollement/courses/${courseId}/enrollments`);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
    }
  };
  useEffect(()=>{
    if(!courseId){
      return;
    }
    fetchStudents();

  },[])

  useEffect(() => {
    if (!socket) return;

    socket.on('userStatusUpdated', fetchStudents);

    return () => {
      socket.off('userStatusUpdated', fetchStudents);
    };
  }, [socket]);


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
       }else {console.log("error  at response")}
      
      
    } catch (err) {
      console.error(error,err)
      console.log("here is the error:" ,err,"and this also:",error )
      toast.error("Error Loading materials", {
        description: "Failed to load course materials"
      });
    } finally {
      setIsLoadingmaterials(false)
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

const deletequiz=async(quizId:string)=>{
  try {
    const response = await api.delete(`/quiz/delete-quizzes/${quizId}`);
    toast.success('Quiz removed successfully');
    fetchQuizzes();
  } catch (error) {
    console.error("Error deleting quiz", error);
  }
}
const deletechapter=async(chapterId:string)=>{
  try {
    const response = await api.delete(`/chapter/delete-chapter/${chapterId}`);
    toast.success('chapter removed successfully');
    fetchChapters();
  } catch (error) {
    console.error("Error deleting chapter", error);
  }
}

const handleChapterCreated = () => {
 
  console.log("Assignment created successfully, refresh data");
  fetchChapters(); //refresh function
};

const handleQuizCreated= () => {
  console.log("Assignment created successfully, refresh data");
  fetchQuizzes(); //refresh function
};

const updateQuizStatus = async (quizId: string, currentStatus: string) => {
  try {
    const newStatus = currentStatus === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
    await api.patch(`/quiz/update-quizzes-dynamically/${quizId}`, { status: newStatus });
    
    // Update local state
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.id === quizId 
          ? { ...quiz, status: newStatus } 
          : quiz
      )
    );
    
    toast.success(`Quiz ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`);
  } catch (error) {
    console.error("Error updating quiz status:", error);
    toast.error("Failed to update quiz status");
  }
};

const updateQuizview = async (quizId: string, currentview: boolean) => {
  try {
    const newview = currentview === false ? true : false;
    await api.patch(`/quiz/update-quizzes-dynamically/${quizId}`, { viewAnswers: newview });
    
    // Update local state
    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz => 
        quiz.id === quizId 
          ? { ...quiz, viewAnswers: newview } 
          : quiz
      )
    );
    
    toast.success(`Quiz ${newview === false ? 'view Enabled' : 'view Desactivated'} successfully`);
  } catch (error) {
    console.error("Error updating quiz status:", error);
    toast.error("Failed to update quiz status");
  }
};

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <IconLinkWithLoading
        href={`/dashboard/teacher/courses`}
        icon={<ArrowLeft className="h-4 w-4" />}
        srText="Back to course"
        variant="ghost"
      />
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
          {isLoadingChapters ? (
                              <div className="flex items-center justify-center h-32">
                                <div>Fetching...</div>
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
                        {/*<DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Chapter
                        </DropdownMenuItem>*/}
                       {/*  <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Add Assignment
                        </DropdownMenuItem>*/}
                        <DropdownMenuItem className="text-destructive"
                        onClick={() => deletechapter(chapter.id)}>
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
                    <LinkWithLoading
                      href={`/dashboard/teacher/courses/${courseId}/chapters/${chapter.id}`}
                      loadingText="Opening lesson..."
                    >
                      View Lesson
                    </LinkWithLoading> 
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
               <AnimatedUpload 
               message="Processing your documents..." 
               size="sm" 
               color="indigo"
             />
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

               {isLoadingmaterials ? (
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
    <Button onClick={() => setIsCreateQUizModalOpen(true)}>
      <HelpCircle className="mr-2 h-4 w-4" />
      Create Quiz
    </Button>
  </div>

  <div className="space-y-4">
    {isLoadingquizzes? (
      <div className="flex items-center justify-center h-32">
        <div>Fetching...</div>
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
                  <Badge variant={quiz.viewAnswers === false ? "default" : "secondary"}>
                    {quiz.viewAnswers === false ? "Answer view Enabled" : "Answer view desactivated"}
                  </Badge>
                  <div>{formatDuration(quiz.duration)} minutes</div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Quiz</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                   { /* <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Quiz
                    </DropdownMenuItem>*/}
                    <DropdownMenuItem 
                      onClick={() => updateQuizStatus(quiz.id, quiz.status)}
                    >
                      {quiz.status === 'DRAFT' ? (
                        <>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Publish Quiz
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Unpublish Quiz
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => updateQuizview(quiz.id, quiz.viewAnswers)}
                    >
                      {quiz.viewAnswers === false ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Desactivate answer view
                        </>
                      ) : (
                        <>
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Enable Answer view
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive"
                    onClick={() => deletequiz(quiz.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Quiz
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Category:{quiz.quizcategorie} Questions</span>
                  <span>Created {formatRelativeTime(quiz.createdAt)}</span>
                </div>
                <LinkWithLoading 
                  href={`/dashboard/teacher/courses/${courseId}/quizzes/${quiz.id}`} 
                  loadingText="Opening lesson..." 
                > 
                  View Quiz 
                </LinkWithLoading> 
                
                <LinkWithLoading 
                  href={`/dashboard/teacher/courses/${courseId}/quizzes/${quiz.id}/edit`} 
                  loadingText="Opening lesson..." 
                > 
                  Add Questions 
                </LinkWithLoading> 
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
              <Link href={`/dashboard/teacher/rankings`}>
                <Button variant="outline">View Rankings</Button>
              </Link>
              {/*<Button variant="outline">Export List</Button>*/}
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
                    <div className={`inline-flex items-center ${student.student?.status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
                      <div className={`h-2 w-2 rounded-full mr-2 ${student.student?.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <div>{student.student?.status}</div>
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
        {/* Add Teacher Section */}
        <div className="grid gap-2">
          <h3 className="text-lg font-medium">Add Co-Teacher</h3>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="teacher-select">Select Teacher</Label>
              <Select 
                onValueChange={(value) => setSelectedTeacherId(value)}
                disabled={isLoadingTeachers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingTeachers ? "Loading teachers..." : "Select a teacher"} />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName} ({teacher.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddTeacher}
              disabled={!selectedTeacherId || isAddingTeacher}
            >
              {isAddingTeacher ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : 'Add Teacher'}
            </Button>
          </div>
        </div>
               {/* Current Co-Teachers List */}
               {isLoadingcourseTeacher ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                courseTeachers.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Current Co-Teachers</Label>
                    <div className="space-y-2">
                      {courseTeachers.map(teacher => (
                        <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{teacher.teacher.firstName} {teacher.teacher.lastName}</p>
                            <p className="text-sm text-muted-foreground">{teacher.teacher.email}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTeacherToDelete(teacher)}
                            disabled={loading.deleting}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

        {/* Danger Zone */}
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
     {/* Delete Confirmation Dialog */}
     <AlertDialog open={!!teacherToDelete} onOpenChange={(open) => !open && setTeacherToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Co-Teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              {teacherToDelete && `Are you sure you want to remove ${teacherToDelete.teacher.firstName} ${teacherToDelete.teacher.lastName} from this course?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTeacher}
              disabled={loading.deleting}
            >
              {loading.deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
</TabsContent>
      </Tabs>

      <CreateChapterModal
        courseId={courseId}
        isOpen={isCreateChapterModalOpen}
        onSuccess={()=>handleChapterCreated()}
        onClose={() => setIsCreateChapterModalOpen(false)}
      />
       <CreateQuizModal
        courseId={courseId}
        userId={userId}
        isOpen={isCreateQuizModalOpen}
        isChapterIdProvided={false}
        isCourseIdProvided={true}
        onSuccess={()=>handleQuizCreated()}
        onClose={() => setIsCreateQUizModalOpen(false)}
      />
      

    </div>
  )
}

