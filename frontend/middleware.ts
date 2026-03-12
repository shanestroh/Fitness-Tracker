import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/api/login", "/api/logout", "/favicon.ico"];

  const isPublic =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images");

  if (isPublic) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get("app_auth")?.value;

  if (authCookie === "ok") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};