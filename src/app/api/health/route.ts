import { NextResponse } from "next/server";
import { env } from "@/config/env";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "bruvi-hq-admin",
    version: "1.0.0",
    framework: "Next.js 16 (App Router + Turbopack)",
    environment: env.APP_ENV,
    runtime: process.version,
    backendApiUrl: env.BACKEND_API_URL,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
}

