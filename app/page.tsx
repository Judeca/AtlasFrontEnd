import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">Learning Platform</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Learn and teach with our platform
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A modern learning platform designed for both teachers and students. Create courses, manage content,
                    and learn at your own pace.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard/teacher">
                    <Button size="lg" className="gap-1">
                      <BookOpen className="h-4 w-4" />
                      Teacher Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/student">
                    <Button size="lg" variant="outline" className="gap-1">
                      <GraduationCap className="h-4 w-4" />
                      Student Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Learning Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

