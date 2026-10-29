import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "bruvi-hq-admin",
    version: "1.0.0",
    framework: "Next.js 16 (App Router + Turbopack)",
    runtime: process.version,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
}

