"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { BookOpen, MessageCircle, Users, Globe, Brain, Zap, ArrowRight, Play, Pause, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const tutorConversation = [
  {
    role: "student",
    message:
      "Hi ATLAS! I'm struggling with this math problem: 'A ball is thrown upward with initial velocity 30 m/s. When will it hit the ground?' I know I need to use physics formulas but I'm confused about which one.",
    timestamp: "14:32",
  },
  {
    role: "atlas",
    message:
      "Hello! Great question! 🎯 Let's think about this step by step. When we throw something up, what force brings it back down?",
    timestamp: "14:32",
    thinking: "Student needs guidance on projectile motion. I'll start with conceptual understanding before formulas.",
  },
  {
    role: "student",
    message: "Gravity! So gravity pulls it down.",
    timestamp: "14:33",
  },
  {
    role: "atlas",
    message:
      "Exactly! 🌟 Now, do you remember the equation that relates position, initial velocity, acceleration, and time? It starts with h = ...",
    timestamp: "14:33",
    thinking: "Good! Now I'll guide them to the kinematic equation.",
  },
  {
    role: "student",
    message: "Um... h = v₀t + ½at²? But I'm not sure about the values to use.",
    timestamp: "14:34",
  },
  {
    role: "atlas",
    message:
      "Perfect formula! 👏 Now let's identify our values: v₀ = 30 m/s (upward), a = -9.8 m/s² (gravity pulls down), and when the ball hits the ground, h = 0. Can you substitute these?",
    timestamp: "14:34",
    thinking: "They know the formula! Now I need to help them with the substitution and signs.",
  },
  {
    role: "student",
    message: "So... 0 = 30t + ½(9.8)t²? Wait, should gravity be positive or negative?",
    timestamp: "14:35",
  },
  {
    role: "atlas",
    message:
      "Good catch on questioning the sign! 🤔 Since we chose upward as positive and gravity pulls downward, a = -9.8 m/s². So: 0 = 30t + ½(-9.8)t² = 30t - 4.9t². Try factoring this!",
    timestamp: "14:35",
    thinking: "They're thinking about signs - excellent! Now to guide them through factoring.",
  },
  {
    role: "student",
    message: "0 = t(30 - 4.9t)... so t = 0 or 30 - 4.9t = 0... t = 30/4.9 ≈ 6.1 seconds!",
    timestamp: "14:36",
  },
  {
    role: "atlas",
    message:
      "EXCELLENT! 🎉🇨🇲 You nailed it! t = 0 is when we throw it, and t ≈ 6.1s is when it lands. You've mastered projectile motion! Want to try a 2D projectile problem next, or explore a different physics topic?",
    timestamp: "14:36",
    thinking: "Perfect solution! They understood the concept completely. Time to celebrate and offer next challenge.",
  },
  {
    role: "student",
    message:
      "Wow, that makes so much sense now! Could you show me a chemistry problem? I'm also struggling with balancing equations.",
    timestamp: "14:37",
  },
  {
    role: "atlas",
    message:
      "Absolutely! 🧪 Let's balance this equation: C₃H₈ + O₂ → CO₂ + H₂O. What's the first step in balancing chemical equations?",
    timestamp: "14:37",
    thinking: "Great transition to chemistry! I'll start with the systematic approach to balancing equations.",
  },
  {
    role: "student",
    message: "Count the atoms on each side?",
    timestamp: "14:38",
  },
  {
    role: "atlas",
    message:
      "Perfect! 🎯 Let's count: Left side has 3 C, 8 H, 2 O. Right side has 1 C, 2 H, 3 O. Which element should we balance first?",
    timestamp: "14:38",
    thinking:
      "They understand the counting step. Now I'll guide them to balance carbon first, then hydrogen, then oxygen.",
  },
  {
    role: "student",
    message: "Carbon? Since there are 3 on the left and 1 on the right, I need 3 CO₂?",
    timestamp: "14:39",
  },
  {
    role: "atlas",
    message: "Brilliant! 🌟 So we have C₃H₈ + O₂ → 3CO₂ + H₂O. Now what about hydrogen? We have 8 H on the left...",
    timestamp: "14:39",
    thinking: "Excellent! They're getting the systematic approach. Now for hydrogen balancing.",
  },
  {
    role: "student",
    message: "8 H on the left means I need 4 H₂O on the right! So C₃H₈ + O₂ → 3CO₂ + 4H₂O",
    timestamp: "14:40",
  },
  {
    role: "atlas",
    message:
      "Outstanding! 🎉 Now for oxygen: Right side has (3×2) + (4×1) = 10 O atoms. So we need 5 O₂ on the left. Final equation: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O ✅",
    timestamp: "14:40",
    thinking: "Perfect! They've mastered the systematic approach to balancing equations. This is excellent progress.",
  },
  {
    role: "student",
    message: "This is amazing! ATLAS, you make learning so much easier. Thank you!",
    timestamp: "14:41",
  },
  {
    role: "atlas",
    message:
      "You're very welcome! 😊🇨🇲 Remember, I'm always here to help you learn. You've shown great problem-solving skills today - from physics to chemistry! Keep asking questions and stay curious. What would you like to explore next?",
    timestamp: "14:41",
    thinking:
      "This student has shown excellent progress and engagement. They're building confidence and understanding core concepts across subjects.",
  },
]

export default function AtlasLandingPage() {
  const [showThinking, setShowThinking] = useState(false)
  const [celebrationMode, setCelebrationMode] = useState(false)
  const [conceptsLearned, setConceptsLearned] = useState<string[]>([])
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [displayedText, setDisplayedText] = useState("")
  const [conversationComplete, setConversationComplete] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [currentMessageIndex, displayedText])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      if (currentMessageIndex < tutorConversation.length) {
        const currentMessage = tutorConversation[currentMessageIndex]
        if (displayedText.length < currentMessage.message.length) {
          setDisplayedText(currentMessage.message.slice(0, displayedText.length + 1))
        } else {
          setTimeout(() => {
            setCurrentMessageIndex((prev) => prev + 1)
            setDisplayedText("")
          }, 2000) // Increased pause between messages
        }
      } else if (!conversationComplete) {
        setConversationComplete(true)
        setCelebrationMode(true)
        setConceptsLearned([
          "Projectile Motion",
          "Kinematic Equations",
          "Sign Conventions",
          "Chemical Balancing",
          "Stoichiometry",
        ])
        setTimeout(() => setCelebrationMode(false), 4000)
        // Auto-restart after completion
        setTimeout(() => {
          setCurrentMessageIndex(0)
          setDisplayedText("")
          setConversationComplete(false)
          setConceptsLearned([])
        }, 8000)
      }
    }, 60) // Faster typing speed

    return () => clearInterval(interval)
  }, [currentMessageIndex, displayedText, isPlaying, conversationComplete])

  const resetSimulation = () => {
    setCurrentMessageIndex(0)
    setDisplayedText("")
    setIsPlaying(true)
    setConversationComplete(false)
    setConceptsLearned([])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">ATLAS</span>
            <span className="text-sm text-muted-foreground hidden sm:block">AI Tutor</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Features
            </Link>
            <Link href="#demo" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Live Demo
            </Link>
            <Link href="#impact" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Impact
            </Link>
            <Link href="#team" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Team
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signIn" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Sign In
            </Link>
            <Link href="/signUp">
              <Button className="bg-emerald-500 hover:bg-emerald-600">Try ATLAS</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-background/90">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 border-emerald-200">
                    🇨🇲 Made in Cameroon for Africa
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    ATLAS – Your Personal <span className="text-emerald-500">AI Tutor</span> for African Classrooms
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Democratizing access to high-quality, context-aware tutoring through AI. Every student deserves a
                    patient, encouraging tutor—no matter where they are.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-emerald-500" />
                      <span>English • Français • Pidgin</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-emerald-500" />
                      <span>GCE & BEPC Aligned</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Link href="/signUp">
                      <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                        Start Learning with ATLAS
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="#demo">
                      <Button size="lg" variant="outline">
                        See ATLAS in Action
                      </Button>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>🎓 500+ students in beta</span>
                    <span>👨‍🏫 30+ teachers using daily</span>
                  </div>
                </div>
              </div>

              {/* AI Tutor Simulation */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <Card
                    className={`shadow-2xl border-2 transition-all duration-500 ${celebrationMode ? "border-yellow-400 shadow-yellow-200" : "border-emerald-200"}`}
                  >
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-4 rounded-t-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Brain className="h-6 w-6" />
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div>
                              <span className="font-bold">ATLAS AI Tutor</span>
                              <div className="text-xs text-emerald-100 flex items-center gap-1">
                                🇨🇲 Cameroon • Physics & Math Specialist
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                              onClick={() => setShowThinking(!showThinking)}
                            >
                              🧠
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-white hover:bg-white/20"
                              onClick={resetSimulation}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar - Fixed */}
                      <div className="px-4 py-2 bg-emerald-50">
                        <div className="flex justify-between text-xs text-emerald-700 mb-1">
                          <span>Learning Progress</span>
                          <span>{Math.round((currentMessageIndex / tutorConversation.length) * 100)}%</span>
                        </div>
                        <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{
                              width: `${Math.min((currentMessageIndex / tutorConversation.length) * 100, 100)}%`,
                              maxWidth: "100%",
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Chat Messages - Fixed height and auto-scroll */}
                      <div
                        ref={chatContainerRef}
                        className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth"
                        style={{ scrollBehavior: "smooth" }}
                      >
                        {tutorConversation.slice(0, currentMessageIndex).map((msg, index) => (
                          <div key={index}>
                            <div className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[85%] ${msg.role === "student" ? "order-2" : "order-1"}`}>
                                <div
                                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                                    msg.role === "student"
                                      ? "bg-blue-500 text-white rounded-br-md"
                                      : "bg-white text-gray-800 border border-emerald-200 rounded-bl-md"
                                  }`}
                                >
                                  {msg.message}
                                </div>
                                <div
                                  className={`text-xs text-gray-500 mt-1 ${msg.role === "student" ? "text-right" : "text-left"}`}
                                >
                                  {msg.timestamp}
                                </div>
                              </div>
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                  msg.role === "student"
                                    ? "bg-blue-500 text-white order-1 ml-2"
                                    : "bg-emerald-500 text-white order-2 mr-2"
                                }`}
                              >
                                {msg.role === "student" ? "👨‍🎓" : "🤖"}
                              </div>
                            </div>

                            {/* AI Thinking Process */}
                            {msg.role === "atlas" && msg.thinking && showThinking && (
                              <div className="ml-10 mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs text-yellow-800">
                                💭 <em>AI Thinking: {msg.thinking}</em>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Current typing message */}
                        {currentMessageIndex < tutorConversation.length && displayedText && (
                          <div>
                            <div
                              className={`flex ${tutorConversation[currentMessageIndex].role === "student" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[85%] ${tutorConversation[currentMessageIndex].role === "student" ? "order-2" : "order-1"}`}
                              >
                                <div
                                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                                    tutorConversation[currentMessageIndex].role === "student"
                                      ? "bg-blue-500 text-white rounded-br-md"
                                      : "bg-white text-gray-800 border border-emerald-200 rounded-bl-md"
                                  }`}
                                >
                                  {displayedText}
                                  <span className="animate-pulse ml-1">|</span>
                                </div>
                              </div>
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                                  tutorConversation[currentMessageIndex].role === "student"
                                    ? "bg-blue-500 text-white order-1 ml-2"
                                    : "bg-emerald-500 text-white order-2 mr-2"
                                }`}
                              >
                                {tutorConversation[currentMessageIndex].role === "student" ? "👨‍🎓" : "🤖"}
                              </div>
                            </div>

                            {/* Show thinking for current AI message */}
                            {tutorConversation[currentMessageIndex].role === "atlas" &&
                              tutorConversation[currentMessageIndex].thinking &&
                              showThinking && (
                                <div className="ml-10 mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 rounded text-xs text-yellow-800 animate-pulse">
                                  💭 <em>AI Thinking: {tutorConversation[currentMessageIndex].thinking}</em>
                                </div>
                              )}
                          </div>
                        )}

                        {/* Celebration Animation */}
                        {celebrationMode && (
                          <div className="text-center py-4">
                            <div className="text-4xl animate-bounce">🎉</div>
                            <div className="text-emerald-600 font-bold animate-pulse">Learning Complete!</div>
                            <div className="text-sm text-gray-600 mt-2">Conversation will restart automatically...</div>
                          </div>
                        )}
                      </div>

                      {/* Footer with concepts learned */}
                      <div className="p-4 bg-white border-t">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live AI Tutoring • Auto-playing</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-emerald-600 hover:bg-emerald-50 text-xs px-2 py-1"
                            onClick={() => setShowThinking(!showThinking)}
                          >
                            {showThinking ? "Hide" : "Show"} AI Thinking 🧠
                          </Button>
                        </div>

                        {conceptsLearned.length > 0 && (
                          <div className="pt-2 border-t">
                            <div className="text-xs text-gray-600 mb-2">📚 Concepts Mastered:</div>
                            <div className="flex flex-wrap gap-1">
                              {conceptsLearned.map((concept, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs"
                                >
                                  ✓ {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Interactive Controls */}
                  <div className="mt-4 text-center space-y-2">
                    <div className="text-sm text-gray-600">
                      👆 Watch ATLAS guide students through complete learning sessions
                    </div>
                    <div className="flex justify-center gap-4 text-xs text-gray-500">
                      <span>🔄 Auto-restarts</span>
                      <span>📜 Auto-scrolls</span>
                      <span>🧠 AI Thinking mode</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-50 dark:bg-red-950/10">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-700">
                The Education Crisis in Cameroon
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">📚</div>
                    <h3 className="font-semibold mb-2">Teacher Shortages</h3>
                    <p className="text-sm text-muted-foreground">Especially in STEM fields and rural schools</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">👥</div>
                    <h3 className="font-semibold mb-2">Overcrowded Classrooms</h3>
                    <p className="text-sm text-muted-foreground">Limited personalized attention for students</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">📊</div>
                    <h3 className="font-semibold mb-2">Learning Gaps</h3>
                    <p className="text-sm text-muted-foreground">Unequal access to quality resources</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-600 mb-2">🏫</div>
                    <h3 className="font-semibold mb-2">Outdated Methods</h3>
                    <p className="text-sm text-muted-foreground">Centralized approaches lacking adaptability</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-500 text-white">
                The ATLAS Solution
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Revolutionary AI-Powered Education</h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl">
                ATLAS is not just another chatbot. It's true educational companionship designed for African learners.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <MessageCircle className="h-10 w-10 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Conversational Learning</h3>
                  <p className="text-muted-foreground">
                    ATLAS talks with students like a kind tutor—asking guiding questions, encouraging critical thinking,
                    never giving away answers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <BookOpen className="h-10 w-10 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Curriculum-Aligned</h3>
                  <p className="text-muted-foreground">
                    Perfectly aligned with Cameroon's GCE and BEPC curriculum, with options for custom syllabi and
                    regional adaptations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Globe className="h-10 w-10 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Multilingual & Localized</h3>
                  <p className="text-muted-foreground">
                    Available in English, French, and Pidgin, with plans for Fulfulde and Ewondo—making education
                    accessible to all.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Users className="h-10 w-10 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Teacher Co-Pilot</h3>
                  <p className="text-muted-foreground">
                    Teachers use ATLAS to create lesson plans, generate quizzes, and get AI-powered performance
                    insights.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Offline Ready</h3>
                  <p className="text-muted-foreground">
                    Designed for regions with weak internet—downloadable modules and asynchronous access coming soon.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">AI for Africa, by Africa</h3>
                  <p className="text-muted-foreground">
                    Fine-tuned for Cameroonian educational needs and African contexts—not a one-size-fits-all solution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Real Impact, Real Results</h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Currently in beta testing across Buea and Yaoundé with measurable outcomes.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
                  <div className="text-lg font-semibold mb-1">Active Students</div>
                  <div className="text-sm text-muted-foreground">Across pilot schools</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">30+</div>
                  <div className="text-lg font-semibold mb-1">Teachers</div>
                  <div className="text-sm text-muted-foreground">Using ATLAS daily</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">20</div>
                  <div className="text-lg font-semibold mb-1">Pilot Schools</div>
                  <div className="text-sm text-muted-foreground">Across 5 regions</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Join the Education Revolution
              </h2>
              <p className="max-w-[600px] mx-auto text-emerald-100 md:text-xl">
                ATLAS is more than a tool. It's a movement to ensure every African learner has access to quality,
                supportive education.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Link href="/signUp">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Try ATLAS Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#team">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-emerald-600"
                  >
                    Meet Our Team
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-emerald-100">
                🏆 Competing at ICT Innovation Week • 🇨🇲 Proudly Cameroonian
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-medium">
              © {new Date().getFullYear()} ATLAS AI Tutor. Democratizing African Education.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Terms
            </Link>
            <Link
              href="mailto:hello@atlas-ai.cm"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
