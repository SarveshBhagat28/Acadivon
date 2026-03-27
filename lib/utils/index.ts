import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calculateAttendancePercentage(
  present: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

export function classesNeededFor75(
  present: number,
  total: number
): number | null {
  const current = calculateAttendancePercentage(present, total);
  if (current >= 75) return null;
  // Solve: (present + x) / (total + x) = 0.75
  const x = Math.ceil((0.75 * total - present) / 0.25);
  return x > 0 ? x : 0;
}

export function calculateXPForLevel(level: number): number {
  return level * 100 * level;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (calculateXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}
