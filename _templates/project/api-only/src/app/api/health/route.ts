import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const runtime = "edge";

export async function GET() {
  const start = Date.now();

  try {
    // Check database connectivity
    await db.execute(sql`SELECT 1`);
    const dbLatency = Date.now() - start;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        checks: {
          database: { status: "up", latencyMs: dbLatency },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        checks: {
          database: { status: "down", error: "Connection failed" },
        },
      },
      { status: 503 }
    );
  }
}
