import { fetchCourses } from "@/lib/Actions/courseActions";
import CoursesList from "./CoursesList";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function CoursesPage() {
  const courses = await fetchCourses();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Button asChild>
          <Link href="/admin/courses/create">
            Create New Course
          </Link>
        </Button>
      </div>
      <CoursesList courses={courses} />
    </div>
  );
}