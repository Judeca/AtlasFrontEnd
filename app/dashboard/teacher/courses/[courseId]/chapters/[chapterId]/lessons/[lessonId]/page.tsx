"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, FilePlus, Pencil, Save, Trash2, Upload, File, Film, FileText,Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import api from "@/app/utils/axiosInstance"
import {formatDuration} from "@/app/utils/functions"

import {FileType,CourseMaterial,fileTypeIcons, isMediaFile,Lesson} from "@/app/utils/fileTypes"



export default function LessonPage() {
  const { courseId, chapterId, lessonId } = useParams() as { 
    courseId: string; 
    chapterId: string; 
    lessonId: string 
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [loading, setLoading] = useState({
    lesson: true,
    materials: true
  })
  const [error, setError] = useState({
    lesson: null,
    materials: null
  })
  const [lessonData, setLessonData] = useState<Lesson>({
    id: "",
    title: "",
    content: "",
    duration: 0,
    order: 0,
    chapterId: "",
    createdAt: "",
    updatedAt: "",
    chapter: {
      title: "",
      courseId: ""
    },
    _count: {
      coursematerials: 0,
      Assignment: 0
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLessonData(prev => ({ ...prev, [name]: value }))
  }

  const fetchLesson = async () => {
    if(!lessonId){
      return;
    }
    try {
      const response = await api.get(`/lesson/lesson-only/${lessonId}`)
      setLessonData(response.data)
    } catch (error) {
      console.error("Error fetching lesson:", error)
      toast.error("Failed to load lesson data")
    }
  }

  useEffect(() => {
    if (lessonId) {
      fetchLesson()
    }
  }, [lessonId])

  const handleSave = async () => {
    try {
      await api.put(`lesson/${lessonId}`, {
        title: lessonData.title,
        content: lessonData.content,
        duration: lessonData.duration
      })
      setIsEditing(false)
      toast.success("Lesson updated successfully")
      fetchLesson() // Refresh data
    } catch (error) {
      console.error("Error updating lesson:", error)
      toast.error("Failed to update lesson")
    }
  }



// Fetch lesson materials
const fetchMaterials = async () => {
  try {
    const response = await api.get(`/coursematerials/lesson/${lessonId}`);
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
      description: "Failed to load lesson materials"
    });
  } finally {
    setLoading(prev => ({...prev, materials: false}));
  }
};

useEffect(() => {
  if(!lessonId){
    return;
  }
  

  fetchMaterials();
}, [lessonId]);


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
      formData.append("lessonId", lessonId);
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
      fetchLesson(); // Refresh materials count
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
        <Link href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to chapter</span>
          </Button>
        </Link>
        <div className="flex-1">
          {isEditing ? (
            <Input
              name="title"
              value={lessonData.title}
              onChange={handleChange}
              className="text-xl font-bold h-auto py-1"
            />
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">{lessonData.title}</h1>
          )}
          <p className="text-muted-foreground">
            Chapter: {lessonData.chapter.title} • Lesson {lessonData.order}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Lesson
              </Button>
              
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="materials">Materials ({lessonData._count.coursematerials})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
              <CardDescription>The main content of this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={lessonData.duration}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={lessonData.content}
                      onChange={handleChange}
                      rows={12}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{formatDuration(lessonData.duration)} minutes</span>
                    <span>•</span>
                    <span>Last updated: {new Date(lessonData.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="prose max-w-none">
                    {lessonData.content.split("\n\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
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
                <CardDescription>
                  {lessonData._count.coursematerials === 0 
                    ? "No materials yet" 
                    : `${lessonData._count.coursematerials} material(s)`}
                </CardDescription>
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
              ) : lessonData._count.coursematerials === 0 ? (
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

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Settings</CardTitle>
              <CardDescription>Configure settings for this lesson</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">These actions cannot be undone</p>
                  <div className="flex items-center justify-between rounded-md border border-destructive/20 p-4">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Lesson</h4>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete this lesson and all its materials
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
    </div>
  )
}