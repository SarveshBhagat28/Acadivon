import type { User, Subject, Timetable, Attendance, Assignment, StudySession, AIInteraction, Achievement, StudyPlan, Insight, Group, Message } from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Subject,
  Timetable,
  Attendance,
  Assignment,
  StudySession,
  AIInteraction,
  Achievement,
  StudyPlan,
  Insight,
  Group,
  Message,
};

// Extended types with relations
export type UserWithRelations = User & {
  subjects?: Subject[];
  achievements?: Achievement[];
};

export type SubjectWithAttendance = Subject & {
  attendances?: Attendance[];
  _count?: {
    attendances: number;
  };
};

export type TimetableWithSubject = Timetable & {
  subject: Subject;
};

export type AttendanceWithSubject = Attendance & {
  subject: Subject;
};

export type AssignmentWithSubject = Assignment & {
  subject: Subject;
};

// UI types
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  locked?: boolean;
}

export interface AttendanceSummary {
  subjectId: string;
  subjectName: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
  classesNeeded: number | null;
}

export interface DashboardStats {
  totalSubjects: number;
  overallAttendance: number;
  pendingAssignments: number;
  studyHoursThisWeek: number;
  currentStreak: number;
  xp: number;
  level: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
