export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const authCookie = req.cookies.get("app_auth")?.value;

  const isAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico";

  if (isAsset) {
    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (authCookie === "ok") {
      return NextResponse.redirect(new URL("/sessions", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/api/login" || pathname === "/api/logout") {
    return NextResponse.next();
  }

  if (authCookie === "ok") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};