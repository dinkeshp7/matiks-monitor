import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("matiks_token")?.value;
  // Note: Token is also in localStorage; cookie enables middleware check
  const path = request.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + "/"));
  const isDashboard = path.startsWith("/dashboard");

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
