import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

// Deliberately minimal: a single shared password via env var, not a full
// user/permissions system - that's a later phase. Middleware always runs in
// the Edge runtime in Next 14.2.x (no Node.js-runtime option existed for
// middleware yet in this version), so only Edge-safe Web APIs are used here
// (atob, not Node's Buffer).
export function middleware(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    // Fail closed, not open - a missing env var should never expose admin routes.
    return new NextResponse("Admin panel not configured", { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Basic ")) {
    const decoded = atob(authHeader.slice(6));
    const password = decoded.slice(decoded.indexOf(":") + 1);
    if (password === adminPassword) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
  });
}
