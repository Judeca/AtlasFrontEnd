import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardSidebar userType="teacher">{children}</DashboardSidebar>
}

