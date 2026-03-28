import type { AssignmentStatus } from "@prisma/client";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function isCompletedStatus(status: AssignmentStatus) {
  return status === "SUBMITTED" || status === "GRADED";
}

export function getAssignmentDisplayStatus(status: AssignmentStatus, dueDate: Date) {
  if (isCompletedStatus(status)) return "Completed" as const;
  if (dueDate.getTime() < Date.now()) return "Overdue" as const;
  return "Pending" as const;
}

export function getCountdownLabel(dueDate: Date) {
  const now = new Date();
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueLocalDate = new Date(
    dueDate.getFullYear(),
    dueDate.getMonth(),
    dueDate.getDate()
  );

  const diffDays = Math.round((dueLocalDate.getTime() - nowDate.getTime()) / ONE_DAY_MS);

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return `Overdue by ${overdueDays} day${overdueDays === 1 ? "" : "s"}`;
  }

  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  return `Due in ${diffDays} days`;
}

export function isDueWithinThreeDays(dueDate: Date) {
  const now = Date.now();
  const diffMs = dueDate.getTime() - now;
  const diffDays = diffMs / ONE_DAY_MS;
  return diffDays >= 0 && diffDays <= 3;
}
