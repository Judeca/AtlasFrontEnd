"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileText, Check, X, AlertCircle, BookOpen, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import api from "@/app/utils/axiosInstance"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { FileType, fileTypeIcons } from "@/app/utils/fileTypes"

export default function SubmissionViewPage() {
    const { courseId, chapterId, assignmentId } = useParams() as { 
        courseId: string; 
        chapterId: string; 
        assignmentId: string 
    }

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [submission, setSubmission] = useState<any>(null)
    const [userId,setUserId]=useState<any>("")



    //fetchIDof User from localstorage
    useEffect(() => {
    const userID = localStorage.getItem("userId"); 
    console.log("HERE IS ",userID)
    if (userID) {
    console.log(userID)
    setUserId(userID)
    }
    },[userId] );


    // Fetch Submission
    useEffect(() => {
        if(!userId || !assignmentId){return ;}
        const fetchSubmission = async () => {
            try {
                const response = await api.get(`/assignmentsubs/assignments/${assignmentId}/submissions/${userId}`) 
                if (response.data) {
                    setSubmission(response.data)
                } else {
                    setError("No submission found")
                }
            } catch (error) {
                console.error("Error fetching submission:", error)
                setError("Failed to load submission details")
            } finally {
                setLoading(false)
            }
        }

        fetchSubmission()
    }, [assignmentId,userId])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="space-y-4 w-full max-w-md">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                        <CardTitle>Error Loading Submission</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}`}>
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Chapter
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!submission) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <BookOpen className="mx-auto h-12 w-12 text-blue-500" />
                        <CardTitle>No Submission Found</CardTitle>
                        <CardDescription>You haven't submitted this assignment yet</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}`}>
                            <Button>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Chapter
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Calculate if the grade is passing (assuming 60% is passing)
    const isPassing = (submission.grade / submission.assignment.maxScore) >= 0.6
    const percentage = (submission.grade / submission.assignment.maxScore) * 100
    const fileExtension = submission.filetype?.split('/').pop()?.toUpperCase() || 
                         submission.fileName?.split('.').pop()?.toUpperCase()
    const FileIcon = fileExtension ? fileTypeIcons[fileExtension as keyof typeof fileTypeIcons] : FileText
    const IconComponent = FileIcon || FileText;
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
            <div className="max-w-4xl mx-auto">
                <Link href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}`}>
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Chapter
                    </Button>
                </Link>

                <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-black text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{submission.assignment.title}</CardTitle>
                                <CardDescription className="text-blue-100">
                                    {submission.assignment.description}
                                </CardDescription>
                            </div>
                            <Badge 
                                variant={isPassing ? "default" : "destructive"} 
                                className="text-sm px-3 py-1"
                            >
                                {isPassing ? (
                                    <Check className="h-4 w-4 mr-1" />
                                ) : (
                                    <X className="h-4 w-4 mr-1" />
                                )}
                                {isPassing ? "PASSED" : "FAILED"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Grade Summary */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">Grade Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Your Score:</span>
                                        <span className={`font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                                            {submission.grade}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Max Score:</span>
                                        <span>{submission.assignment.maxScore}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Percentage:</span>
                                        <span className={`font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                                            {percentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge 
                                            variant={isPassing ? "default" : "destructive"} 
                                            className="ml-2"
                                        >
                                            {submission.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Submission Details */}
                            <div className="bg-white p-6 rounded-lg border shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">Your Submission</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <IconComponent className="h-8 w-8 text-blue-600" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{submission.fileName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            onClick={() => window.open(submission.fileUrl, '_blank')}
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Section */}
                        <div className="bg-black text-white p-6 rounded-lg border shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Teacher Feedback</h3>
                            {submission.feedback ? (
                                <div className="prose prose-blue max-w-none">
                                    <p>{submission.feedback}</p>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <p>No feedback provided by the teacher</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <Link href={`/dashboard/student/courses/${courseId}/chapters/${chapterId}`}>
                                <Button>
                                    Back to Chapter
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}