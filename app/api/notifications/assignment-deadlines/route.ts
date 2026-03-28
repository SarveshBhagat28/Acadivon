import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/api/authenticated-request";
import {
  getAssignmentDisplayStatus,
  getCountdownLabel,
  isDueWithinThreeDays,
} from "@/lib/assignments/status";

interface AssignmentNotification {
  id: string;
  assignmentId: string;
  title: string;
  message: string;
  dueDate: string;
  createdAt: string;
}
const MAX_NOTIFICATIONS = 6;

function buildNotification(assignment: {
  id: string;
  title: string;
  dueDate: Date;
}) {
  const countdown = getCountdownLabel(assignment.dueDate);
  return {
    id: `assignment-due-${assignment.id}`,
    assignmentId: assignment.id,
    title: "Assignment deadline reminder",
    message: `${assignment.title} is ${countdown.toLowerCase()}.`,
    dueDate: assignment.dueDate.toISOString(),
    createdAt: new Date().toISOString(),
  } satisfies AssignmentNotification;
}

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
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
      },
      orderBy: { dueDate: "asc" },
    });

    const notifications = assignments
      .filter((assignment) => {
        const displayStatus = getAssignmentDisplayStatus(
          assignment.status,
          assignment.dueDate
        );

        if (displayStatus === "Completed") return false;
        if (!isDueWithinThreeDays(assignment.dueDate)) return false;
        return true;
      })
      .map(buildNotification)
      .slice(0, MAX_NOTIFICATIONS);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Assignment notifications GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
