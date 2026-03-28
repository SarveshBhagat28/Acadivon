import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/api/authenticated-request";

const updateSchema = z.object({
  status: z.enum(["PENDING", "SUBMITTED", "GRADED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid assignment status" },
        { status: 400 }
      );
    }

    const existing = await prisma.assignment.findFirst({
      where: { id, userId: auth.user.id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    const assignment = await prisma.assignment.update({
      where: { id },
      data: { status: parsed.data.status },
      select: {
        id: true,
        status: true,
        dueDate: true,
      },
    });

    return NextResponse.json({ success: true, data: assignment });
  } catch (error) {
    console.error("Assignment PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
