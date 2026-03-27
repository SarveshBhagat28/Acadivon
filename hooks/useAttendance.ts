"use client";

import { useState, useCallback, useMemo } from "react";
import type {
  ClassSlot,
  WeekDay,
  AttendanceSummary,
  AttendanceStatus,
  ScannedClass,
} from "@/components/attendance/types";

export const TIME_SLOTS = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_FULL_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const SUBJECT_COLORS: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  teal: {
    bg: "bg-teal-100",
    text: "text-teal-800",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200",
    dot: "bg-pink-500",
  },
};

const INITIAL_SLOTS: ClassSlot[] = [
  {
    id: "1",
    subject: "Mathematics",
    subjectColor: "blue",
    room: "LH-101",
    startTime: "8:00",
    dayIndex: 0,
    status: "PRESENT",
  },
  {
    id: "2",
    subject: "Physics",
    subjectColor: "purple",
    room: "LH-203",
    startTime: "10:00",
    dayIndex: 0,
    status: "ABSENT",
  },
  {
    id: "3",
    subject: "Data Structures",
    subjectColor: "green",
    room: "CS-Lab",
    startTime: "9:00",
    dayIndex: 1,
    status: "PRESENT",
  },
  {
    id: "4",
    subject: "Machine Learning",
    subjectColor: "orange",
    room: "LH-305",
    startTime: "14:00",
    dayIndex: 1,
    status: "LATE",
  },
  {
    id: "5",
    subject: "Mathematics",
    subjectColor: "blue",
    room: "LH-101",
    startTime: "8:00",
    dayIndex: 2,
    status: "PRESENT",
  },
  {
    id: "6",
    subject: "Algorithms",
    subjectColor: "teal",
    room: "CS-Lab",
    startTime: "11:00",
    dayIndex: 2,
    status: "CANCELLED",
  },
  {
    id: "7",
    subject: "Physics",
    subjectColor: "purple",
    room: "LH-203",
    startTime: "9:00",
    dayIndex: 3,
    status: "PRESENT",
  },
  {
    id: "8",
    subject: "Machine Learning",
    subjectColor: "orange",
    room: "LH-305",
    startTime: "15:00",
    dayIndex: 3,
    status: "PRESENT",
  },
  {
    id: "9",
    subject: "Data Structures",
    subjectColor: "green",
    room: "CS-Lab",
    startTime: "8:00",
    dayIndex: 4,
    status: "ABSENT",
  },
  {
    id: "10",
    subject: "Algorithms",
    subjectColor: "teal",
    room: "CS-Lab",
    startTime: "10:00",
    dayIndex: 4,
    status: "PRESENT",
  },
  {
    id: "11",
    subject: "Mathematics",
    subjectColor: "blue",
    room: "LH-101",
    startTime: "9:00",
    dayIndex: 5,
    status: null,
  },
];

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function useAttendance() {
  const [weekStart, setWeekStart] = useState<Date>(() =>
    getMondayOfWeek(new Date())
  );
  const [slots, setSlots] = useState<ClassSlot[]>(INITIAL_SLOTS);

  const weekDays = useMemo((): WeekDay[] => {
    return DAY_LABELS.map((label, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return {
        label,
        fullLabel: DAY_FULL_LABELS[index],
        date,
        dateStr: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  }, [weekStart]);

  const weekRangeLabel = useMemo(() => {
    const start = weekDays[0];
    const end = weekDays[5];
    if (!start || !end) return "";
    return `${start.dateStr} – ${end.dateStr}, ${end.date.getFullYear()}`;
  }, [weekDays]);

  const goToPrevWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }, []);

  const updateStatus = useCallback(
    (slotId: string, status: AttendanceStatus) => {
      setSlots((prev) =>
        prev.map((s) => (s.id === slotId ? { ...s, status } : s))
      );
    },
    []
  );

  const getSlot = useCallback(
    (dayIndex: number, time: string): ClassSlot | undefined => {
      return slots.find(
        (s) => s.dayIndex === dayIndex && s.startTime === time
      );
    },
    [slots]
  );

  const applyScannedData = useCallback((scanned: ScannedClass[]) => {
    const newSlots: ClassSlot[] = scanned.map((cls, index) => ({
      id: `scanned-${index}-${Date.now()}`,
      subject: cls.subject,
      subjectColor: getColorForSubject(cls.subject),
      room: cls.room,
      startTime: cls.startTime,
      dayIndex: cls.dayOfWeek,
      status: cls.status,
    }));
    setSlots(newSlots);
  }, []);

  const analysisSummary = useMemo((): AttendanceSummary[] => {
    const subjectMap = new Map<string, AttendanceSummary>();

    for (const slot of slots) {
      const existing = subjectMap.get(slot.subject);
      if (!existing) {
        subjectMap.set(slot.subject, {
          subject: slot.subject,
          subjectColor: slot.subjectColor,
          present: 0,
          absent: 0,
          late: 0,
          cancelled: 0,
          total: 0,
          percentage: 0,
        });
      }
      const entry = subjectMap.get(slot.subject)!;
      entry.total += 1;
      if (slot.status === "PRESENT") entry.present += 1;
      else if (slot.status === "ABSENT") entry.absent += 1;
      else if (slot.status === "LATE") entry.late += 1;
      else if (slot.status === "CANCELLED") entry.cancelled += 1;
    }

    return Array.from(subjectMap.values()).map((s) => {
      const effective = s.present + s.absent + s.late;
      return {
        ...s,
        percentage:
          effective === 0 ? 0 : Math.round((s.present / effective) * 100),
      };
    });
  }, [slots]);

  const overallStats = useMemo(() => {
    const present = slots.filter((s) => s.status === "PRESENT").length;
    const absent = slots.filter((s) => s.status === "ABSENT").length;
    const late = slots.filter((s) => s.status === "LATE").length;
    const cancelled = slots.filter((s) => s.status === "CANCELLED").length;
    const total = present + absent + late;
    return {
      present,
      absent,
      late,
      cancelled,
      total,
      percentage: total === 0 ? 0 : Math.round((present / total) * 100),
    };
  }, [slots]);

  return {
    weekDays,
    weekStart,
    weekRangeLabel,
    slots,
    timeSlots: TIME_SLOTS,
    goToPrevWeek,
    goToNextWeek,
    updateStatus,
    getSlot,
    applyScannedData,
    analysisSummary,
    overallStats,
    SUBJECT_COLORS,
  };
}

function getColorForSubject(subject: string): keyof typeof SUBJECT_COLORS {
  const colors = Object.keys(SUBJECT_COLORS) as Array<keyof typeof SUBJECT_COLORS>;
  if (colors.length === 0) return "blue";
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
