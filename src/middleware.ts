import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/services/auth/config";

export async function middleware(req: NextRequest) {
  const session = await auth(); // for Server Component

  // Allow access to home page ("/") without authentication
  if (req.nextUrl.pathname === "/") {
    return NextResponse.next();
  }

  // If user is NOT authenticated and trying to access a protected page, redirect to "/"
  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to routes below
export const config = {
  matcher: ["/design-list", "/design/:path*"],
};
