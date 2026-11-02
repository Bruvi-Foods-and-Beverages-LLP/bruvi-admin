import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";

/**
 * Enterprise BFF Proxy Route Handler
 * Proxies requests to internal NestJS backend while injecting service correlation IDs
 * and internal service secrets.
 */
async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subpath = path.join("/");
  const baseUrl = env.BACKEND_API_URL.replace(/\/+$/, "");
  const cleanSubpath = subpath.replace(/^\/+/, "");
  const targetUrl = new URL(`${baseUrl}/${cleanSubpath}`);

  // Forward query string
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", request.headers.get("host") || "localhost");
  headers.delete("host");

  // Enterprise Token Ingestion:
  // If no explicit Authorization header was provided in the request,
  // extract the authenticated token from the secure session cookie.
  const cookieToken = request.cookies.get("bruvi_admin_token")?.value;
  if (!headers.get("authorization") && cookieToken && cookieToken.trim().length > 0) {
    headers.set("authorization", `Bearer ${cookieToken.trim()}`);
  }

  try {
    const backendResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.blob(),
      redirect: "manual",
    });

    const responseHeaders = new Headers(backendResponse.headers);

    // Strip hop-by-hop & compression headers decoded by Node runtime
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("connection");

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("BFF Proxy Gateway Error:", error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 502,
        message: "Internal Backend Service Unreachable",
        error: "BadGateway",
        path: subpath,
        timestamp: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };

