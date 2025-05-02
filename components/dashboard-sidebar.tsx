"use client"
import { useState, useEffect } from "react"
import { useSocket } from '@/app/context/SocketContext';
import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import api from "@/app/utils/axiosInstance"
import { 
  BookOpen, GraduationCap, LayoutDashboard, LogOut, Trophy, 
  Users, ChevronDown, ChevronRight, BarChart4, BookOpenCheck,
  User, UserPlus, Key, List, CheckCircle,
  Bell
} from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DashboardSidebarProps {
  userType: "teacher" | "student" | "admin"
  children: React.ReactNode
}

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: {
    title: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
     badgeCount?: number
  }[]
  badgeCount?: number
}

export function DashboardSidebar({ userType, children }: DashboardSidebarProps) {
  const { socket } = useSocket();
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const [notifications, setNotifications] = useState<any[]>([])
  const [userInfo, setuserinfo] = useState<any>()
  const [unseenCount, setUnseenCount] = useState(0)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState({
    initialLoad: true,
    markingSeen: false
  })

  useEffect(() => {
    const userID = localStorage.getItem("userId")
    if (userID) {
      setUserId(userID)
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await api.get(`/notification/notifications/student/${userId}`)
      setNotifications(response.data.notifications)
      setUnseenCount(response.data.unseenCount)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(prev => ({ ...prev, initialLoad: false }))
    }
  }
  useEffect(() => {
    if (!userId) return
    getuserInfo()
  }, [userId])
   const getuserInfo=async()=>{
      try {
        const response = await api.get(`/users/get-user/${userId}`);
        console.log("userInfo:",response.data)
        setuserinfo(response.data)
      } catch (error) {
        console.error("Error deleting quiz", error);
      }
    }

  useEffect(() => {
    if (!userId) return
    fetchNotifications()
  }, [userId])


  useEffect(() => {
    if (!socket) return;

    socket.on('new_notification_broadcast', fetchNotifications);

    return () => {
      socket.off('new_notification_broadcast', fetchNotifications);
    };
  }, [socket]);

  const teacherNavItems: NavItem[] = [
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
      title: "Others Courses",
      href: "/dashboard/teacher/otherCourses",
      icon: BookOpen,
    },
    {
      title: "Rankings",
      href: "/dashboard/teacher/rankings",
      icon: Trophy,
    },
  ]

  const studentNavItems: NavItem[] = [
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
      title: "Rankings",
      href: "/dashboard/student/rankings",
      icon: Trophy,
    },
    {
      title: "Notifications",
      href: "/dashboard/student/notification",
      icon: Bell,
      badgeCount: unseenCount > 0 ? unseenCount : undefined
    },
  ]

  const adminNavItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      icon: Users,
      subItems: [
        {
          title: "All Users",
          href: "/dashboard/admin/users/list",
          icon: User
        },
        {
          title: "Create User",
          href: "/dashboard/admin/users/Created",
          icon: UserPlus
        },
        {
          title: "Roles & Permissions",
          href: "/dashboard/admin/users/roles",
          icon: Key
        }
      ]
    },
    {
      title: "Course Administration",
      icon: BookOpenCheck,
      subItems: [
        {
          title: "All Courses",
          href: "/dashboard/admin/courses/list",
          icon: List
        },
        {
          title: "Course Approval",
          href: "/dashboard/admin/courses/approvals",
          icon: CheckCircle
        }
      ]
    },
    {
      title: "System Analytics",
      href: "/dashboard/admin/analytics",
      icon: BarChart4,
    }
  ]

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem("userId")
    localStorage.removeItem("quizDeadline")
    window.location.href = "/signIn"
  }

  const navItems = userType === "teacher" ? teacherNavItems : userType === "student" ? studentNavItems : adminNavItems

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
                <div key={item.title}>
                  <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild={!!item.href}
                      isActive={pathname === item.href || (item.subItems && item.subItems.some(subItem => pathname === subItem.href))}
                      onClick={!item.href ? () => toggleExpand(item.title) : undefined}
                      className={cn(
                        "justify-between",
                        !item.href && "cursor-pointer"
                      )}
                    >
                      {item.href ? (
                        <Link href={item.href} className="flex items-center w-full">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 ml-3">{item.title}</span>
                          {item.badgeCount !== undefined && item.badgeCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground">
                              {item.badgeCount}
                            </span>
                          )}
                        </Link>
                      ) : (
                        <div className="flex items-center w-full">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 ml-3">{item.title}</span>
                          {expandedItems[item.title] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {item.subItems && expandedItems[item.title] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const IconComponent = subItem.icon || BookOpen // Default icon if none provided
                        return (
                          <SidebarMenuItem key={subItem.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === subItem.href}
                              className="pl-8"
                            >
                              <Link href={subItem.href} className="flex items-center">
                                <IconComponent className="h-4 w-4" />
                                <span className="ml-3">{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>
                  {userType === "teacher" ? "T" : userType === "student" ? "S" : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 text-sm">
                <div className="font-medium capitalize">{userInfo?.user?.firstName} {` ${userInfo?.user?.lastName}`}</div>
                <div className="text-xs text-muted-foreground capitalize">{userType} Account</div>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="icon" className="ml-auto">
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
                
              </nav>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}