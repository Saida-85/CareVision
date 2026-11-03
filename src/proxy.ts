import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "carevision_secure_jwt_secret_key_2026";

export async function proxy(request: NextRequest) {
  // 1. Retrieve current user session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Clone request headers so we can attach custom headers
  const requestHeaders = new Headers(request.headers);

  // 3. If a valid session exists, generate a signed JWT token and attach it
  if (session?.user) {
    const jwtToken = jwt.sign(
      {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Attach the JWT as a standard Authorization Bearer header
    requestHeaders.set("authorization", `Bearer ${jwtToken}`);
    requestHeaders.set("x-user-id", session.user.id);
  }

  // 4. Forward request with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Apply proxy middleware to protected routes requiring authorization
export const config = {
  matcher: [
    "/create-event",
    "/manage-events",
    "/joined-events",
    "/api/events/create",
    "/api/events/manage",
  ],
};