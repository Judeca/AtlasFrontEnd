import Link from "next/link"
import Image from "next/image"
import { BookOpen, Layers, Users, Award, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold">Atlas</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Features
            </Link>
            <Link href="#courses" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Courses
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signIn" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Sign In
            </Link>
            <Link href="/signUp">
              <Button className="bg-emerald-500 hover:bg-emerald-600">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-background/90">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Learn Anything, <span className="text-emerald-500">Anywhere</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Atlas helps you master new skills with interactive courses, expert instructors, and a supportive
                    community.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signUp">
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#courses">
                    <Button size="lg" variant="outline">
                      Explore Courses
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-muted-foreground">
                    Join <span className="font-medium text-foreground">10,000+</span> learners
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]">
                  <Image
                    src="/educationimage.jpg"
                    alt="Atlas Learning Platform"
                    width={500}
                    height={500}
                    className="rounded-lg shadow-xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-500 text-primary-foreground hover:bg-emerald-500/80">
                  Why Choose Atlas
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features that set us apart</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to make learning effective, engaging, and accessible for everyone.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 rounded-lg border p-6 shadow-sm">
                <BookOpen className="h-10 w-10 text-emerald-500" />
                <h3 className="text-xl font-bold">Interactive Courses</h3>
                <p className="text-muted-foreground">
                  Learn by doing with hands-on exercises, quizzes, and projects that reinforce your knowledge.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border p-6 shadow-sm">
                <Users className="h-10 w-10 text-emerald-500" />
                <h3 className="text-xl font-bold">Expert Instructors</h3>
                <p className="text-muted-foreground">
                  Learn from industry professionals with years of experience in their respective fields.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border p-6 shadow-sm">
                <Award className="h-10 w-10 text-emerald-500" />
                <h3 className="text-xl font-bold">Recognized Certificates</h3>
                <p className="text-muted-foreground">
                  Earn certificates that are recognized by top companies and institutions worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to start learning?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of learners who are already advancing their careers with Atlas.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signUp">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="#pricing">
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-medium">© {new Date().getFullYear()} Atlas Learning. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
