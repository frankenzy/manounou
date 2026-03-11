import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/manounou", "/user", "/app", "/dashboard"];
// const PROTECTED_PATHS = ["/user", "/app", "/dashboard"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const authToken = request.cookies.get("authToken")?.value;
  const tenantId =
    request.cookies.get("tenantId")?.value ||
    request.headers.get("x-tenant-id") ||
    searchParams.get("tenantId") ||
    "public";

  if (isProtectedPath(pathname) && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/api/v1") && !authToken) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.next();
  response.headers.set("x-tenant-id", tenantId);
  return response;
}

export const config = {
  matcher: ["/user/:path*", "/app/:path*", "/dashboard/:path*", "/api/v1/:path*"],
};