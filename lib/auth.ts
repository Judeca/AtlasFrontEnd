
import { jwtVerify } from "jose";

interface DecodedToken {
  id: string;
  role: string;
  email: string;
  [key: string]: any; // Additional token claims
}

export async function verifyToken(token: string): Promise<DecodedToken> {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    
    return payload as DecodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}


export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export const handleLogout = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  localStorage.removeItem("userId")
  localStorage.removeItem("quizDeadline")
  window.location.href = "/signIn"
}