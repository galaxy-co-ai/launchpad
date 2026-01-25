import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ratelimit } from "@/lib/ratelimit";
import { z } from "zod";

export const runtime = "edge";

// Request validation schema
const createSchema = z.object({
  name: z.string().min(1).max(255),
  data: z.record(z.unknown()).optional(),
});

// GET /api/v1/[example]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ example: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const { success, remaining } = await ratelimit.limit(userId);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { "X-RateLimit-Remaining": remaining.toString() } }
      );
    }

    const { example } = await params;

    // TODO: Replace with actual database query
    return NextResponse.json({
      id: example,
      message: "Replace this with your actual implementation",
      userId,
    });
  } catch (error) {
    console.error("[API] GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/[example]
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting (stricter for writes)
    const { success } = await ratelimit.limit(`${userId}:write`);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await request.json();
    const validated = createSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    // TODO: Replace with actual database insert
    const result = {
      id: crypto.randomUUID(),
      ...validated.data,
      userId,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[API] POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/[example]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ example: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { example } = await params;

    // TODO: Replace with actual database delete
    // Ensure user owns the resource before deleting

    return NextResponse.json({ deleted: true, id: example });
  } catch (error) {
    console.error("[API] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
