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
  const targetUrl = new URL(`${env.BACKEND_API_URL}/${subpath}`);

  // Forward query string
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.set(key, value);
  });

  const headers = new Headers(request.headers);
  headers.set("x-internal-secret", env.INTERNAL_API_SECRET);
  headers.set("x-forwarded-host", request.headers.get("host") || "localhost");
  headers.delete("host");

  try {
    const backendResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.blob(),
      redirect: "manual",
    });

    const responseHeaders = new Headers(backendResponse.headers);

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

