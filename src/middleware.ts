import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/",
  "/environmental",
  "/social",
  "/governance",
  "/gamification",
  "/settings",
  "/reports",
];

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Check if path is protected
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Skip API routes and static assets
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
