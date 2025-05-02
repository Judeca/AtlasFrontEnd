// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./lib/auth"; // Your token verification utility

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|public).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Define routes
  const publicRoutes = ["/", "/LandingPage", "/contact"]; // Accessible to everyone
  const authRoutes = ["/signIn", "/signUp", "/reset-password"];
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/settings"
  ];

  // Handle auth routes for logged-in users
  if (authRoutes.some(route => path.startsWith(route))) {
    if (token) {
      try {
        const decoded = await verifyToken(token);
        // Redirect based on role
        const redirectPath = getRoleBasedRedirect(decoded.role);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } catch (error) {
        // Invalid token, clear cookies
        const response = NextResponse.redirect(new URL("/signIn", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (protectedRoutes.some(route => path.startsWith(route)) || 
      path.startsWith("/dashboard/student") || 
      path.startsWith("/dashboard/teacher") ||
      path.startsWith("/dashboard/admin")) {
    
    if (!token) {
      return NextResponse.redirect(new URL("/signIn", request.url));
    }

    try {
      const decoded = await verifyToken(token);
      
      // Role-based routing protection
      if (path.startsWith("/dashboard/student") && decoded.role.toLowerCase() !== "student") {
        const redirectPath = getRoleBasedRedirect(decoded.role);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      if (path.startsWith("/dashboard/teacher") && decoded.role.toLowerCase() !== "teacher") {
        const redirectPath = getRoleBasedRedirect(decoded.role);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      if (path.startsWith("/dashboard/admin") && decoded.role.toLowerCase() !== "admin") {
        const redirectPath = getRoleBasedRedirect(decoded.role);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Invalid token, clear cookies and redirect
      const response = NextResponse.redirect(new URL("/signIn", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // Public routes - no authentication required
  return NextResponse.next();
}

// Helper functions
function getRoleBasedRedirect(role: string): string {
  const roleRoutes: Record<string, string> = {
    student: "/dashboard/student",
    teacher: "/dashboard/teacher",
    admin: "/dashboard/admin",
  };
  return roleRoutes[role.toLowerCase()] || "/dashboard";
}