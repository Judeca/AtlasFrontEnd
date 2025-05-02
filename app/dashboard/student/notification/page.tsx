"use client"

import { useState, useEffect } from "react"
import { useSocket } from '@/app/context/SocketContext';
import api from "@/app/utils/axiosInstance"
import Link from "next/link"
import { Bell, Check, Loader2, MoreHorizontal } from "lucide-react"
import { formatRelativeTime } from "@/app/utils/functions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LinkWithLoading } from "@/components/link-with-loading"

export default function StudentNotificationsPage() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<any[]>([])
  const [unseenCount, setUnseenCount] = useState(0)
  const [loading, setLoading] = useState({
    initialLoad: true,
    markingSeen: false
  })
  const [userId, setUserId] = useState('')

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
    if (!socket) return;

    socket.on('new_notification_broadcast', fetchNotifications);

    return () => {
      socket.off('new_notification_broadcast', fetchNotifications);
    };
  }, [socket]);

  const markNotificationsAsSeen = async () => {
    try {
      setLoading(prev => ({ ...prev, markingSeen: true }))
      
      // Get IDs of unseen notifications
      const unseenIds = notifications
        .filter(notif => !notif.seen)
        .map(notif => notif.id)

      if (unseenIds.length > 0) {
        await api.patch(`/notification/notifications/mark-as-seen/${userId}`, {
          notificationIds: unseenIds
        })
        
        // Update local state to reflect seen status
        setNotifications(prev => 
          prev.map(notif => ({
            ...notif,
            seen: true
          }))
        )
        setUnseenCount(0)
      }
    } catch (error) {
      console.error("Error marking notifications as seen:", error)
    } finally {
      setLoading(prev => ({ ...prev, markingSeen: false }))
    }
  }

  useEffect(() => {
    if (!userId) return
    fetchNotifications()
  }, [userId])

  useEffect(() => {
    if (notifications.length === 0 || unseenCount === 0) return
    
    // Mark notifications as seen after 2 seconds
    const timer = setTimeout(() => {
      markNotificationsAsSeen()
    }, 2000)

    return () => clearTimeout(timer)
  }, [notifications, unseenCount])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {unseenCount > 0 ? (
              <span>
                You have <span className="text-primary font-medium">{unseenCount}</span> new notification{unseenCount !== 1 ? 's' : ''}
              </span>
            ) : (
              "All caught up!"
            )}
          </p>
        </div>
        
        <Badge variant="outline" className="px-4 py-2">
          <Bell className="mr-2 h-4 w-4" />
          Total: {notifications.length}
        </Badge>
      </div>

      {loading.initialLoad ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`relative overflow-hidden ${!notification.seen ? 'border-l-4 border-primary' : ''}`}
            >
              {/* Unseen indicator */}
              {!notification.seen && (
                <div className="absolute top-4 left-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {notification.title}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>
                {notification.course && (
                  <CardDescription>
                    Course: {notification.course.title}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground">
                  {notification.message || "No additional message"}
                </p>
                
                {notification.courseId && (
                  <div className="mt-4 flex justify-end">
                     <LinkWithLoading
                      href={`/dashboard/student/courses/${notification.courseId}`}
                      loadingText="Opening course..."
                    >
                      View course
                    </LinkWithLoading>  
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-2 font-medium">No notifications yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You'll see notifications here when they arrive
            </p>
          </CardContent>
        </Card>
      )}
      
      {loading.markingSeen && (
        <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-md shadow-sm border flex items-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span>Updating notifications...</span>
        </div>
      )}
    </div>
  )
}