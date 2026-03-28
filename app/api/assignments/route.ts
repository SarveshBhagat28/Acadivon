import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/api/authenticated-request";

const createAssignmentSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required"),
  dueDate: z.string().datetime("Due date is invalid"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const assignments = await prisma.assignment.findMany({
      where: { userId: auth.user.id },
      orderBy: { dueDate: "asc" },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: assignments });
  } catch (error) {
    console.error("Assignments GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();
    const parsed = createAssignmentSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    let subject = await prisma.subject.findFirst({
      where: { userId: auth.user.id },
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          userId: auth.user.id,
          name: "General",
          code: "GEN",
          credits: 0,
          color: "#2196F3",
        },
        select: { id: true },
      });
    }

    const assignment = await prisma.assignment.create({
      data: {
        userId: auth.user.id,
        subjectId: subject.id,
        title: parsed.data.title,
        description: parsed.data.description,
        dueDate: new Date(parsed.data.dueDate),
        priority: parsed.data.priority,
        status: "PENDING",
      },
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch (error) {
    console.error("Assignments POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
