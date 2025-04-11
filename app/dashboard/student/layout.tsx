import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardSidebar userType="student">{children}</DashboardSidebar>
}

