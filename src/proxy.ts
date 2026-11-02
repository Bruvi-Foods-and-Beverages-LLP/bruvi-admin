import { NextResponse, type NextRequest } from "next/server";
import { generateCspHeader } from "@/lib/security/csp";

/**
 * Enterprise Next.js Edge Middleware
 * Runs at the network boundary before requests reach route handlers or server components.
 * Enforces enterprise security headers, CSP nonces, and session-based route protection.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("bruvi_admin_token")?.value;
  const isAuthenticated = Boolean(token && token.trim().length > 0);

  // 1. Session Boundary Routing
  const isAuthPage = pathname === "/login";
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/.test(pathname);

  // If unauthenticated user attempts to visit protected dashboard routes, redirect to /login
  if (!isAuthenticated && !isAuthPage && !isPublicAsset) {
    const redirectUrl = new URL("/login", request.url);
    const returnPath = pathname + search;
    if (returnPath !== "/") {
      redirectUrl.searchParams.set("redirect", returnPath);
    }
    return NextResponse.redirect(redirectUrl);
  }

  // If already authenticated user visits /login, redirect to executive dashboard
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Cryptographic Nonce & Enterprise CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const { cspHeader } = generateCspHeader(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "x-correlation-id",
    `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 3. Enterprise Security Headers
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self), payment=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default proxy;
