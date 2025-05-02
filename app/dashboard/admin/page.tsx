"use client"
import { Users, BookOpen, FileText, Shield, BarChart2, Clock, Layers, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    totalCourses: 0,
    activeCourses: 0,
    pendingApprovals: 0
  })

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 1243,
        newUsers: 42,
        totalCourses: 87,
        activeCourses: 63,
        pendingApprovals: 12
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const dashboardCards = [
    {
      title: "User Management",
      description: "Manage all user accounts and permissions",
      icon: <Users className="h-6 w-6" />,
      href: "/dashboard/admin/users/list",
      bgColor: "bg-black text-white",
      stats: stats.totalUsers,
      statLabel: "Total Users",
      trend: "↑ 12% this month"
    },
    {
      title: "Roles & Permissions",
      description: "Configure access levels and user roles",
      icon: <Shield className="h-6 w-6" />,
      href: "/dashboard/admin/users/roles",
      bgColor: "bg-black text-white",
      stats: "5",
      statLabel: "Role Types",
      trend: "Customizable"
    },
    {
      title: "New Signups",
      description: "View recently created user accounts",
      icon: <FileText className="h-6 w-6" />,
      href: "/dashboard/admin/users/Created",
      bgColor: "bg-black text-white",
      stats: stats.newUsers,
      statLabel: "New Users",
      trend: "↓ 3% from last week"
    },
    {
      title: "Course Catalog",
      description: "Manage all available courses",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/dashboard/admin/courses/list",
      bgColor: "bg-black text-white",
      stats: stats.totalCourses,
      statLabel: "Total Courses",
      trend: "↑ 8 new this month"
    },
    {
      title: "Active Courses",
      description: "Courses currently being accessed",
      icon: <BarChart2 className="h-6 w-6" />,
      href: "/dashboard/admin/courses/list",
      bgColor: "bg-black text-white",
      stats: stats.activeCourses,
      statLabel: "Active Now",
      trend: "72% engagement"
    },
    {
      title: "Pending Approvals",
      description: "Items requiring admin review",
      icon: <Clock className="h-6 w-6" />,
      href: "#",
      bgColor: "bg-black text-white",
      stats: stats.pendingApprovals,
      statLabel: "Waiting",
      trend: "3 urgent"
    }
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Last updated: Just now</span>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeCourses}</div>
                <p className="text-xs text-muted-foreground">72% engagement rate</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Signups</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.newUsers}</div>
                <p className="text-xs text-muted-foreground">-3% from last week</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">3 marked as urgent</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Link key={index} href={card.href}>
            <Card className={cn(
              "h-full transition-all hover:shadow-lg hover:scale-[1.02] border-0",
              card.bgColor === "bg-black text-white" ? "bg-black text-white" : "bg-white text-black"
            )}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={card.bgColor.includes("black") ? "text-white" : "text-black"}>
                    {card.title}
                  </CardTitle>
                  <div className={cn(
                    "p-2 rounded-lg",
                    card.bgColor.includes("black") ? "bg-white/10" : "bg-black/10"
                  )}>
                    {card.icon}
                  </div>
                </div>
                <p className={cn(
                  "text-sm",
                  card.bgColor.includes("black") ? "text-white/70" : "text-black/70"
                )}>
                  {card.description}
                </p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className={cn(
                    "h-8 w-24 mb-2",
                    card.bgColor.includes("black") ? "bg-white/20" : "bg-black/20"
                  )} />
                ) : (
                  <>
                    <div className={cn(
                      "text-3xl font-bold mb-1",
                      card.bgColor.includes("black") ? "text-white" : "text-black"
                    )}>
                      {card.stats}
                    </div>
                    <div className="flex justify-between items-end">
                      <span className={cn(
                        "text-sm",
                        card.bgColor.includes("black") ? "text-white/70" : "text-black/70"
                      )}>
                        {card.statLabel}
                      </span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        card.bgColor.includes("black") ? "bg-white/20" : "bg-black/10"
                      )}>
                        {card.trend}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[250px]" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  user: "Sarah Johnson",
                  action: "created a new course",
                  target: "Advanced React Patterns",
                  time: "2 minutes ago",
                  icon: <BookOpen className="h-5 w-5 text-blue-500" />
                },
                {
                  id: 2,
                  user: "Michael Chen",
                  action: "updated user role",
                  target: "from Student to Instructor",
                  time: "15 minutes ago",
                  icon: <Shield className="h-5 w-5 text-purple-500" />
                },
                {
                  id: 3,
                  user: "System",
                  action: "completed maintenance",
                  target: "Database optimization",
                  time: "1 hour ago",
                  icon: <Award className="h-5 w-5 text-green-500" />
                }
              ].map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="p-2 bg-accent rounded-full">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span></div>
                    <div className="text-sm text-muted-foreground">{activity.target}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}