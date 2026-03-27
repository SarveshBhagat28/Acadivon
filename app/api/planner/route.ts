import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/auth/firebase-admin";
import { prisma } from "@/lib/db";
import { generateStudyPlan } from "@/lib/ai/planner";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const decodedToken = await verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const plans = await prisma.studyPlan.findMany({
      where: { userId: user.id, isActive: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error("Planner GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const decodedToken = await verifyIdToken(token);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { goals } = body;

    // Gather data for planner
    const [timetables, assignments, insights] = await Promise.all([
      prisma.timetable.findMany({
        where: { userId: user.id },
        include: { subject: true },
      }),
      prisma.assignment.findMany({
        where: { userId: user.id, status: { in: ["PENDING", "IN_PROGRESS"] } },
        include: { subject: true },
        orderBy: { dueDate: "asc" },
      }),
      prisma.insight.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const planContent = await generateStudyPlan({
      userId: user.id,
      timetable: timetables.map((t) => ({
        subject: t.subject.name,
        dayOfWeek: t.dayOfWeek,
        startTime: t.startTime,
        endTime: t.endTime,
      })),
      assignments: assignments.map((a) => ({
        subject: a.subject.name,
        title: a.title,
        dueDate: a.dueDate.toISOString(),
        status: a.status,
      })),
      insights: insights.map((i) => ({
        type: i.type,
        content: i.content,
      })),
      goals,
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const plan = await prisma.studyPlan.create({
      data: {
        userId: user.id,
        title: `Study Plan - Week of ${startDate.toLocaleDateString()}`,
        startDate,
        endDate,
        content: planContent as object,
      },
    });

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error("Planner POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
