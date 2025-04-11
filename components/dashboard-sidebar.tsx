"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, GraduationCap, Home, LayoutDashboard, Library, LogOut, Settings, Trophy, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  userType: "teacher" | "student"
  children: React.ReactNode
}

export function DashboardSidebar({ userType, children }: DashboardSidebarProps) {
  const pathname = usePathname()

  const teacherNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/teacher",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      href: "/dashboard/teacher/courses",
      icon: BookOpen,
    },
    {
      title: "Students",
      href: "/dashboard/teacher/students",
      icon: GraduationCap,
    },
    {
      title: "Rankings",
      href: "/dashboard/teacher/rankings",
      icon: Trophy,
    },
    {
      title: "Settings",
      href: "/dashboard/teacher/settings",
      icon: Settings,
    },
  ]

  const studentNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard/student",
      icon: LayoutDashboard,
    },
    {
      title: "My Courses",
      href: "/dashboard/student/courses",
      icon: BookOpen,
    },
    {
      title: "Library",
      href: "/dashboard/student/library",
      icon: Library,
    },
    {
      title: "Profile",
      href: "/dashboard/student/profile",
      icon: User,
    },
    {
      title: "Rankings",
      href: "/dashboard/student/rankings",
      icon: Trophy,
    },
  ]

  const navItems = userType === "teacher" ? teacherNavItems : studentNavItems

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6" />
              <span className="text-lg font-bold">Learning Platform</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <Avatar>
               
                <AvatarFallback>{userType === "teacher" ? "T" : "S"}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 text-sm">
                <div className="font-medium">{userType === "teacher" ? "rugal Yurib" : "Jane Smith"}</div>
                <div className="text-xs text-muted-foreground">{userType === "teacher" ? "Teacher" : "Student"}</div>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
            <SidebarTrigger />
            <div className="w-full flex-1">
              <nav className="flex items-center space-x-4 lg:space-x-6">
                <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

