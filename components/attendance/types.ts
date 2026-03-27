export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "CANCELLED";

export interface ClassSlot {
  id: string;
  subject: string;
  subjectColor: string;
  room?: string;
  startTime: string; // "8:00" format (24-hr)
  dayIndex: number; // 0 = Monday, 5 = Saturday
  status: AttendanceStatus | null;
}

export interface WeekDay {
  label: string; // "Mon"
  fullLabel: string; // "Monday"
  date: Date;
  dateStr: string; // "Mar 24"
}

export interface AttendanceSummary {
  subject: string;
  subjectColor: string;
  present: number;
  absent: number;
  late: number;
  cancelled: number;
  total: number;
  percentage: number;
}

export interface ScannedTimetableData {
  classes: ScannedClass[];
  batch?: string;
}

export interface ScannedClass {
  subject: string;
  room?: string;
  dayOfWeek: number; // 0=Monday, 5=Saturday
  startTime: string; // "8:00" format
  status: AttendanceStatus | null;
}
