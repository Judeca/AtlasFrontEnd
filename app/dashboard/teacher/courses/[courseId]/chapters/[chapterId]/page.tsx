"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, ChevronRight, FilePlus, Pencil, Trash2, FileText, Upload, Download,File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateLessonModal } from "@/components/create-lesson-modal"
import { CreateAssignmentModal } from "@/components/create-assignment-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import api from "@/app/utils/axiosInstance"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {formatDuration} from "@/app/utils/functions"

import {FileType,CourseMaterial,fileTypeIcons,isMediaFile} from "@/app/utils/fileTypes"

import { toast } from "sonner"
import { LinkWithLoading } from "@/components/link-with-loading"
import { IconLinkWithLoading } from "@/components/icon-link-with-loading"
import AnimatedUpload from "@/components/AnimatedLoading"

export default function ChapterPage() {
  const { courseId, chapterId } = useParams() as { courseId: string; chapterId: string }
  const [activeTab, setActiveTab] = useState("lessons")

  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false)
  const [assignments, setAssignments] = useState<any[]>([])
  const [isCreateAssignmentModalOpen, setIsCreateAssignmentModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [fileExtension,setFileExt]=useState<any>("")
  const [loading, setLoading] = useState({
    chapter: true,
    lessons: true,
    assignments: true,
    materials:true
  })

   const [materials, setMaterials] = useState<CourseMaterial[]>([])
    const [error, setError] = useState({
      lesson: null,
      materials: null
    })

  const [chapter, setChapter] = useState<any>(null)
  
  const [lessons, setLessons] = useState<any[]>([])

  // Fetch chapter info
  useEffect(() => {
    if (!chapterId) return;

    const fetchChapter = async () => {
      try {
        const response = await api.get(`chapter/${chapterId}/chapter`)
        setChapter(response.data)
      } catch (error) {
        console.error("Error fetching chapter:", error)
      } finally {
        setLoading(prev => ({ ...prev, chapter: false }))
      }
    }

    if (courseId && chapterId) {
      fetchChapter()
    }
  }, [courseId, chapterId])

  // Fetch lessons info in a chapter
  const fetchLessons = async () => {
    try {
      const response = await api.get(`lesson/chapters/${chapterId}/lessons`)
      setLessons(response.data || [])
    } catch (error) {
      console.error("Error fetching lessons:", error)
      setLessons([])
    } finally {
      setLoading(prev => ({ ...prev, lessons: false }))
    }
  }
  useEffect(() => {
    if(!chapterId){
      return;
    }
      fetchLessons()
    
  }, [chapterId])


   // Fetch assignments info in a chapter
   useEffect(() => {
    if(!courseId){
      return;
    }
    fetchAssignments();

    if (courseId) {
      fetchAssignments()
    }
  }, [courseId])

  const fetchAssignments = async () => {
    try {
      const response = await api.get(`/assignment/chapters/${chapterId}/assignments`)
      setAssignments(response.data || [])
    } catch (error) {
      console.error("Error fetching assignments:", error)
      setAssignments([])
    } finally {
      setLoading(prev => ({ ...prev, assignments: false }))
    }
  }




    // Fetch chapter materials
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
}, [chapterId]);

  //file upload

const handleFileUploadMaterials = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    formData.append("chapterId", chapterId); 
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

  
  const handleFileUploadAssignments = async (e: React.ChangeEvent<HTMLInputElement> ,assignmentId:string) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const MAX_FILE_SIZE_MB = 60;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    // File size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return;
    }
    let fileexten=""
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", courseId);
      formData.append("chapterId", chapterId); 
  
      // Determine file type and select appropriate upload endpoint
      const fileType = file.type.split('/')[0]; // 'image', 'video', etc.
      const isMediaFiletrue = isMediaFile(file);
      console.log("Here is Media file",isMediaFiletrue)
      //const uploadEndpoint = isMediaFiletrue ? '/coursematerials/upload'  :'/coursematerials/upload' ;
  
      // Get file extension for additional validation if needed
      const fileExt = file.name.split('.').pop()?.toUpperCase();
      console.log(fileExt)
      fileexten=fileExt!
      setFileExt(fileExt)
      console.log("verify",fileexten)
  
      // Upload to appropriate service
      const response = await api.post("/uploadthing/api/upload", formData, {
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
      if(response){
        console.log("Here are the credentials after upload juve:",response.data)
        console.log("Uploaded filename:", response.data.uploadFile[0].data.ufsUrl);
        const filename=response.data.uploadFile[0].data.name
        const fileurl=response.data.uploadFile[0].data.ufsUrl
        console.log("Ifo ",filename,fileurl,fileexten)

          if(!assignmentId){
            return;
          }
          try {
            const response = await api.put(`/assignment/update-assignment/${assignmentId}`,{
              fileName:filename,
              fileUrl:fileurl,
             filetype:fileexten
            })
            console.log("Assignment updated",response.data)
            fetchAssignments()
          } catch (error) {
            console.error("Error fetching lesson:", error)
            toast.error("Failed to load lesson data")
          }
        

      }
  
      if (response.data.error) {
        throw new Error(response.data.error);
      }
  
      toast.success(`${file.name} uploaded successfully`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Video and Images are not allowed ",{
          description: "File upload failed.File type may not be supported change and  Please try again."}
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAssignmentCreated = () => {
    // Your refresh logic here
    console.log("Assignment created successfully, refresh data");
    fetchAssignments(); // Example refresh function
  };

  const handleLessonCreated = () => {
    // Your refresh logic here
    console.log("Assignment created successfully, refresh data");
    fetchLessons(); // Example refresh function
  };
  

  if (loading.chapter) {
    return (
      <div className="grid gap-6">
        <Skeleton className="h-10 w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center gap-2">
        <IconLinkWithLoading
          href={`/dashboard/teacher/courses/${courseId}`}
          icon={<ArrowLeft className="h-4 w-4" />}
          srText="Back to course"
          variant="ghost"
        /> 
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chapter not found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
         <IconLinkWithLoading
          href={`/dashboard/teacher/courses/${courseId}`}
          icon={<ArrowLeft className="h-4 w-4" />}
          srText="Back to course"
          variant="ghost"
        /> 
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{chapter.title}</h1>
          <p className="text-muted-foreground">
            Course: {chapter.courseTitle} • Chapter {chapter.order}
          </p>
        </div>
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lessons" onClick={() => setActiveTab("lessons")}>
              Lessons
            </TabsTrigger>
            <TabsTrigger value="assignments" >
              Assignments
            </TabsTrigger>
            <TabsTrigger value="materials" >
              Documents
            </TabsTrigger>
            
          </TabsList>
          
          
           
          
            
          
        </div>

        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Lessons</CardTitle>
              <CardDescription>Manage the lessons in this chapter</CardDescription>
              <Button onClick={() => setIsCreateLessonModalOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Add Lesson
            </Button>
            </CardHeader>
            <CardContent>
              {loading.lessons ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : lessons.length > 0 ? (
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between rounded-md border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Lesson {lesson.order}</Badge>
                            <p className="font-medium">{lesson.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatDuration(lesson.duration)} minutes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit Lesson</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Lesson
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Lesson
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <LinkWithLoading
                  href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/lessons/${lesson.id}`}
                  loadingText="Opening lesson..."
                >
                  View Lesson
                </LinkWithLoading>  
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-2 font-medium">No lessons yet</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create a lesson to get started</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsCreateLessonModalOpen(true)}>
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create Lesson
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>



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
                      onChange={handleFileUploadMaterials}
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
                              color="purple"
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


        <TabsContent value="assignments">
  <Card>
    <CardHeader>
      <CardTitle>Chapter Assignments</CardTitle>
      <CardDescription>Manage assignments for this chapter</CardDescription>
      <Button onClick={() => setIsCreateAssignmentModalOpen(true)}>
        <FileText className="mr-2 h-4 w-4" />
        Add Assignment
      </Button>
    </CardHeader>
    
    <CardContent>
      {loading.assignments ? (
        <div className="space-y-4">
          {[1].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((assignment) => {
            // Determine file icon and status
            const fileExtension = assignment.filetype?.split('/').pop()?.toUpperCase() || 
                                 assignment.fileName?.split('.').pop()?.toUpperCase();
            const FileIcon = fileExtension ? fileTypeIcons[fileExtension as keyof typeof fileTypeIcons] : FileText;
           
            const IconComponent = FileIcon || FileText;
            const hasFile = assignment.fileUrl && assignment.fileName;
            
            return (
              <div key={assignment.id} className="flex flex-col rounded-md border p-4"  onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between"  onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">{assignment.title}</h3>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit Assignment</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Assignment
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Assignment
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <p className="text-sm text-muted-foreground mt-1">{assignment.description}</p>
                
                {/* File status section */}
                <div className="mt-2">
                  {hasFile ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                      <span>{assignment.fileName}</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {fileExtension}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>No file attached</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between mt-4 text-sm">
                  <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  <span>{assignment.submissionsCount} submissions</span>
                </div>
                
                <div className="mt-4 flex gap-2">
                <Button asChild variant={hasFile ? "outline" : "default"}>
  <label
    htmlFor={`material-upload-${assignment.id}`}
    className="relative inline-flex items-center cursor-pointer"
  >
    <Upload className="mr-2 h-4 w-4" />
    {hasFile ? "Replace File" : "Upload File"}
    <input
      id={`material-upload-${assignment.id}`}
      type="file"
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
      onChange={(e) => handleFileUploadAssignments(e, assignment.id)}
      disabled={isUploading}
    />
  </label>
</Button>
                  
                  <Link
                    href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/assignments/${assignment.id}`}
                  >
                    <Button variant="outline" size="sm">
                      View Submissions
                    </Button>
                  </Link>
                  
                  {hasFile && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(assignment.fileUrl, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
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
            Create an assignment for students to complete
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setIsCreateAssignmentModalOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
       
        
        
        

      </Tabs>

      <CreateLessonModal
        courseId={courseId}
        chapterId={chapterId}
        isOpen={isCreateLessonModalOpen}
        onSuccess={()=>handleLessonCreated()}
        onClose={() => setIsCreateLessonModalOpen(false)}
      />

      <CreateAssignmentModal
        courseId={courseId}
        chapterId={chapterId}
        isLessonIdProvided={false}
        isOpen={isCreateAssignmentModalOpen}
        onSuccess={()=>handleAssignmentCreated()}
        onClose={() => setIsCreateAssignmentModalOpen(false)}
      />

      
    </div>
  )
}


