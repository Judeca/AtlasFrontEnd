"use client";

import { useState } from "react";
import { fetchCourses,deleteCourse } from "@/lib/Actions/courseActions";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Teacher {
  firstName: string;
  lastName: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  teacher: Teacher;
}

interface Props {
  courses: Course[];
}

export default function CoursesList({ courses }: Props) {
  const [courseList, setCourseList] = useState(courses);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    
    setDeletingId(courseToDelete.id);
    try {
      const result = await deleteCourse(courseToDelete.id);
      if (result.success) {
        setCourseList(prev => prev.filter(course => course.id !== courseToDelete.id));
        toast.success("Course deleted successfully", {
          description: `${courseToDelete.title} has been removed.`
        });
      } else {
        toast.error("Failed to delete course", {
          description: result.message
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setDeletingId(null);
      setCourseToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-50">Course Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseList.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell className="text-muted-foreground">
                {course.description}
              </TableCell>
              <TableCell>
                {course.teacher.firstName} {course.teacher.lastName}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(course)}
                  disabled={deletingId === course.id}
                >
                  {deletingId === course.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{courseToDelete?.title}</span> and
              all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={!!deletingId}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deletingId ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}