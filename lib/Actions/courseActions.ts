"use server"

//Fetch All Courses 
export async function fetchCourses() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/shared-list-course`, {
      cache: "no-store",
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }
  
    return await res.json();
  }

  export async function deleteCourse(courseId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/shared-delete-course/${courseId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        throw new Error("Failed to delete course");
      }
  
      return { success: true, message: "Course deleted successfully" };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete course" 
      };
    }
  }