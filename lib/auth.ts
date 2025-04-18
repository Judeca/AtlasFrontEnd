
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