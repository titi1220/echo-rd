import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const hasDemoAccess = process.env.NODE_ENV !== "production";
    const hasSession = request.cookies.has("sb-access-token") || request.cookies.has("supabase-auth-token");

    if (!hasDemoAccess && !hasSession) {
      return NextResponse.redirect(new URL("/contact", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
