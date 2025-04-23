
import {  File, Film, FileText,FileIcon } from "lucide-react"

// Define the possible file types
export type FileType = 'PDF' | 'DOC' | 'DOCX' | 'PPT' | 'PPTX' | 'XLS' | 'XLSX' | 'TXT' | 'MP4' | 'MKV' | 'AVI' | 'FLV' | 'MOV'

// Define the material interface
export interface CourseMaterial {
  id: string
  courseId: string | null
  userId: string | null
  chapterId: string | null
  lessonId: string | null
  fileName: string 
  fileUrl: string 
  fileType: FileType // or use a specific enum type if you have one
  content: string | null
  uploadedAt: string
} 

export interface Lesson {
  id: string
  title: string
  content: string
  html:string|null
  duration: number
  order: number
  chapterId: string
  createdAt: string
  updatedAt: string
  chapter: {
    title: string
    courseId: string
  }
  _count: {
    coursematerials: number
    Assignment: number
  }
}

export const fileTypeIcons = {
  PDF: FileText,
  DOC: File,
  DOCX: File,
  PPT: File,
  PPTX: File,
  XLS: File,
  XLSX: File,
  TXT: FileText,
  MP4: Film,
  MKV: Film,
  AVI: Film,
  FLV: Film,
  MOV: Film,
  IMAGE:Film
}













// utils/fileTypes.ts
export const isImageFile = (file: File) => {
    const normalizedType = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    const imageMimes = ['image/'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    
    return imageMimes.some(mime => normalizedType.startsWith(mime)) || 
           imageExtensions.includes(extension);
  };
  
  export const isVideoFile = (file: File) => {
    const normalizedType = file.type.toLowerCase();
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    
    const videoMimes = ['video/'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    
    return videoMimes.some(mime => normalizedType.startsWith(mime)) || 
           videoExtensions.includes(extension);
  };
  
  export const isMediaFile = (file: File) => 
    isImageFile(file) || isVideoFile(file);