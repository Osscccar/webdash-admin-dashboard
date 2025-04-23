import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes and public assets
  if (
    pathname.startsWith("/api/") ||
    pathname.includes(".") ||
    pathname === "/login"
  ) {
    return NextResponse.next();
  }

  // Protect all dashboard routes
  if (pathname.startsWith("/dashboard") || pathname === "/") {
    // Check if user is logged in via your auth cookie/token
    const isLoggedIn = !!request.cookies.get("auth_token")?.value;

    if (!isLoggedIn) {
      // Redirect to login page
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if 2FA is verified
    const is2FAVerified = request.cookies.get("2fa_verified")?.value === "true";

    if (!is2FAVerified) {
      // Redirect to login page with 2FA flag
      return NextResponse.redirect(
        new URL("/login?require2fa=true", request.url)
      );
    }
  }

  return NextResponse.next();
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes (/api/*)
    // - Static files (e.g. /favicon.ico)
    // - Public assets (e.g. /images/*)
    "/((?!_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
