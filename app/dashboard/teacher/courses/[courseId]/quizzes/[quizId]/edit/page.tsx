"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, HelpCircle, Loader2, Plus, Trash2, Save, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from "@/app/utils/axiosInstance"
import { isImageFile } from "@/app/utils/fileTypes"

interface Question {
  quizId: string
  text: string
  fileName?: string
  fileUrl?: string
  questionType: string
  difficulty: string
  options: Array<{ text: string; isCorrect: boolean }>
  correctAnswers: string[]
}

export default function EditQuizPage() {
  const { courseId, quizId } = useParams() as { courseId: string; quizId: string }
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    quizId: quizId,
    text: "",
    questionType: "MCQ",
    difficulty: "EASY",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false }
    ],
    correctAnswers: []
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    
    const file = e.target.files[0]
    
    if (!isImageFile(file)) {
      toast.error("Only image files are allowed")
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSaveQuestion = async () => {
    if (!currentQuestion.text) {
      toast.error("Question text is required")
      return
    }

    if (currentQuestion.correctAnswers.length === 0) {
      toast.error("Please select at least one correct answer")
      return
    }

    try {
      setIsLoading(true)
      
      // Upload file if selected
      let fileUrl = ""
      let fileName = ""
      
      if (selectedFile) {
        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)

        const uploadResponse = await api.post("question/upload-questions", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })

        if (uploadResponse.data.error) {
          throw new Error(uploadResponse.data.error)
        }

        fileUrl = uploadResponse.data.result.secure_url
        fileName = uploadResponse.data.originalFileName
      }

      // Create question with file data
      const questionData = {
        ...currentQuestion,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined 
      }

      const response = await api.post("/question/create-questions", questionData)
      
      setSavedQuestions(prev => [...prev, response.data])
      resetQuestionForm()
      toast.success("Question saved successfully")
    } catch (error) {
      console.error("Error saving question:", error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to save question"
      )
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  const resetQuestionForm = () => {
    setCurrentQuestion({
      quizId: quizId,
      text: "",
      questionType: "MCQ",
      difficulty: "EASY",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false }
      ],
      correctAnswers: []
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...currentQuestion.options]
    newOptions[index] = { ...newOptions[index], [field]: value }
    
    const correctAnswers = newOptions
      .filter(opt => opt.isCorrect)
      .map(opt => opt.text)

    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions,
      correctAnswers
    }))
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleFinishQuiz = () => {
    router.push(`/dashboard/teacher/courses/${courseId}/quizzes/${quizId}`)
  }

  return (
    <div className="grid gap-6">
      {/* ... existing header code ... */}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Saved Questions Preview - updated to show images */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Saved Questions</CardTitle>
              <CardDescription>
                {savedQuestions.length === 0 
                  ? "No questions saved yet" 
                  : `${savedQuestions.length} saved question${savedQuestions.length !== 1 ? 's' : ''}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedQuestions.map((question, index) => (
                <div key={index} className="rounded-md border p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Q{index + 1}</Badge>
                    <Badge variant="secondary">{question.difficulty}</Badge>
                  </div>
                  {question.fileUrl && (
                    <div className="mb-3">
                      <img 
                        src={question.fileUrl} 
                        alt={question.fileName || "Question image"}
                        className="max-h-40 rounded-md border"
                      />
                    </div>
                  )}
                  <p className="font-medium">{question.text}</p>
                  <div className="mt-2 space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        {option.isCorrect ? <Check className="h-4 w-4 text-green-500" /> : null}
                        <p className={option.isCorrect ? "text-green-600" : ""}>
                          {option.text || `Option ${optIndex + 1}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Question Creation Form - updated with image upload */}
        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Create Question</CardTitle>
              <CardDescription>Fill in the details for your new question</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Question Type, Text, Difficulty - existing code remains the same */}
              <div className="grid gap-2">
                <Label>Question Type</Label>
                <Select
                  value={currentQuestion.questionType}
                  onValueChange={value => setCurrentQuestion(prev => ({ ...prev, questionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">Multiple Choice</SelectItem>
                    <SelectItem value="TRUE_OR_FALSE">True/False</SelectItem>
                    <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Question Text</Label>
                <Textarea
                  value={currentQuestion.text}
                  onChange={e => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Enter your question here"
                />
              </div>

              <div className="grid gap-2">
                <Label>Difficulty</Label>
                <Select
                  value={currentQuestion.difficulty}
                  onValueChange={value => setCurrentQuestion(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCE">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
        <Label>Answer Options</Label>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={option.text}
                onChange={e => handleOptionChange(index, 'text', e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {currentQuestion.questionType === 'MCQ' && (
          <div className="mt-4">
            <Label>Select Correct Answer</Label>
            <Select
              value={currentQuestion.correctAnswers[0] || ""}
              onValueChange={(value) => {
                const newOptions = currentQuestion.options.map(opt => ({
                  ...opt,
                  isCorrect: opt.text === value
                }))
                setCurrentQuestion(prev => ({
                  ...prev,
                  options: newOptions,
                  correctAnswers: [value]
                }))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options.map((option, index) => (
                  <SelectItem 
                    key={index} 
                    value={option.text || `Option ${index + 1}`}
                  >
                    {option.text || `Option ${index + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
              {/* Image Upload Section */}
              <div className="grid gap-2">
                <Label>Question Image (Optional)</Label>
                {previewUrl ? (
                  <div className="space-y-2">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-h-40 rounded-md border"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRemoveImage}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="question-image"
                      className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 w-full cursor-pointer hover:bg-accent/50"
                    >
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm">Click to upload image</span>
                    </Label>
                    <Input
                      id="question-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </div>

              {/* Rest of the form remains the same */}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                className="w-full" 
                onClick={handleSaveQuestion}
                disabled={isLoading || isUploading}
              >
                {(isLoading || isUploading) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Question
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full text-green-600 hover:text-green-700"
                onClick={handleFinishQuiz}
              >
                Finish Creating Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}