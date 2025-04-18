"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, ChevronRight, FilePlus, Pencil, Trash2, FileText, Upload, Download, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useParams } from "next/navigation"
import api from "@/app/utils/axiosInstance"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { FileType, fileTypeIcons } from "@/app/utils/fileTypes"

export default function SubmissionPage() {
    const { courseId, chapterId, assignmentId } = useParams() as { 
        courseId: string; 
        chapterId: string; 
        assignmentId: string 
    }

    const [isUploading, setIsUploading] = useState(false)
    const [loading, setLoading] = useState({
        submissions: true,
    })
    const [error, setError] = useState("")
    const [submissions, setSubmissions] = useState<any[]>([])
    const [isGrading, setIsGrading] = useState(false)
    const [currentSubmission, setCurrentSubmission] = useState<any>(null)
    const [grade, setGrade] = useState("")
    const [feedback, setFeedback] = useState("")

    // Fetch Submissions
    useEffect(() => {
        if (!assignmentId) return;

        const fetchSubmissions = async () => {
            try {
                const response = await api.get(`/assignmentsubs/assignments/${assignmentId}/submissions`)
                setSubmissions(response.data)
            } catch (error) {
                console.error("Error fetching submissions:", error)
                setError("Failed to load submissions")
            } finally {
                setLoading(prev => ({ ...prev, submissions: false }))
            }
        }

        fetchSubmissions()
    }, [assignmentId])

    const handleGradeSubmission = async () => {
        if (!currentSubmission || !grade) {
            toast.error("Please enter a grade")
            return
        }

        try {
            setIsUploading(true)
            const response = await api.put(
                `/assignmentsubs/assignments/${currentSubmission.assignmentId}/submissions/${currentSubmission.student.id}/grade`,
                {
                    grade: parseFloat(grade),
                    feedback
                }
            )

            // Update local state
            setSubmissions(prev => prev.map(sub => 
                sub.id === currentSubmission.id ? response.data : sub
            ))

            toast.success("Submission graded successfully!")
            setIsGrading(false)
            setCurrentSubmission(null)
            setGrade("")
            setFeedback("")
        } catch (error) {
            console.error("Error grading submission:", error)
            toast.error("Failed to grade submission")
        } finally {
            setIsUploading(false)
        }
    }

    const openGradeDialog = (submission: any) => {
        setCurrentSubmission(submission)
        setGrade(submission.grade?.toString() || "")
        setFeedback(submission.feedback || "")
        setIsGrading(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Chapter
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Assignment Submissions</CardTitle>
                    <CardDescription>
                        Review and grade student submissions for this assignment
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading.submissions ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-4 text-red-500">
                            {error}
                        </div>
                    ) : submissions.length > 0 ? (
                        <div className="space-y-6">
                            {submissions.map((submission) => {
                                const fileExtension = submission.filetype?.split('/').pop()?.toUpperCase() || 
                                                    submission.fileName?.split('.').pop()?.toUpperCase()
                                const FileIcon = fileExtension ? fileTypeIcons[fileExtension as keyof typeof fileTypeIcons] : FileText
                                const IconComponent = FileIcon || FileText;
                                return (
                                    <div key={submission.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium">
                                                    {submission.student.firstName} {submission.student.lastName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {submission.student.email}
                                                </p>
                                            </div>
                                            <Badge 
                                                variant={
                                                    submission.status === "GRADED" ? "default" :
                                                    submission.status === "SUBMITTED" ? "secondary" : "outline"
                                                }
                                            >
                                                {submission.status === "GRADED" ? "Graded" :
                                                 submission.status === "SUBMITTED" ? "Submitted" : "Pending"}
                                            </Badge>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium">Assignment: {submission.assignment.title}</h4>
                                            <p className="text-sm text-muted-foreground">{submission.assignment.description}</p>
                                        </div>

                                        {submission.fileUrl && (
                                            <div className="mt-4 flex items-center gap-4 p-3 bg-muted/50 rounded-md">
                                                <IconComponent className="h-5 w-5" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{submission.fileName}</p>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <span className="bg-background px-2 py-1 rounded-full">
                                                            {fileExtension}
                                                        </span>
                                                        <span>
                                                            Submitted on {new Date(submission.submittedAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => window.open(submission.fileUrl, '_blank')}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}

                                        {submission.grade && (
                                            <div className="mt-4">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-medium">Grade:</span>
                                                    <span className="text-lg">
                                                        {submission.grade}/{submission.assignment.maxScore}
                                                    </span>
                                                </div>
                                                {submission.feedback && (
                                                    <div className="mt-2">
                                                        <p className="font-medium">Feedback:</p>
                                                        <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-4 flex justify-end gap-2">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => openGradeDialog(submission)}
                                            >
                                                {submission.status === "GRADED" ? "Update Grade" : "Grade Submission"}
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="rounded-md border border-dashed p-6 text-center">
                            <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                            <h3 className="mt-2 font-medium">No submissions yet</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Students haven't submitted any work for this assignment yet
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Grading Dialog */}
            <Dialog open={isGrading} onOpenChange={setIsGrading}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grade Submission</DialogTitle>
                        <DialogDescription>
                            Enter grade and feedback for {currentSubmission?.student?.firstName} {currentSubmission?.student?.lastName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Grade</label>
                            <Input 
                                type="number" 
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                min="0"
                                max={currentSubmission?.assignment?.maxScore || 100}
                                placeholder="Enter grade"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Max score: {currentSubmission?.assignment?.maxScore || 100}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Feedback</label>
                            <Textarea 
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Enter feedback (optional)"
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsGrading(false)}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleGradeSubmission}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <span className="flex items-center">
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Grading...
                                </span>
                            ) : (
                                "Submit Grade"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
