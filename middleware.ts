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
 console.log("runing middle")
  // Define routes
  const publicRoutes = ["/", "/LandingPage", "/contact"]; // Accessible to everyone
  const authRoutes = ["/signIn", "/signUp", "/forgot-password"];
  const protectedRoutes = [
    "/dashboard",
    "/student",
    "/teacher",
    "/admin",
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
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/signIn", request.url));
    }

    try {
      const decoded = await verifyToken(token);
      
      // Role-based routing protection
      const basePath = path.split("/")[1];
      if (basePath && !isAuthorizedRoute(basePath, decoded.role)) {
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

function isAuthorizedRoute(path: string, role: string): boolean {
  const rolePermissions: Record<string, string[]> = {
    student: ["student", "dashboard", "profile"],
    teacher: ["teacher", "dashboard", "profile"],
    admin: ["admin", "dashboard", "profile", "settings"],
  };
  
  const allowedPaths = rolePermissions[role.toLowerCase()] || [];
  return allowedPaths.includes(path);
}