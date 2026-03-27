"use client";

import { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { ClassSlot, WeekDay, AttendanceStatus } from "./types";

const STATUS_STYLES: Record<
  AttendanceStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  PRESENT: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
    label: "Present",
  },
  ABSENT: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
    label: "Absent",
  },
  LATE: {
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    label: "Late",
  },
  CANCELLED: {
    bg: "bg-gray-100",
    text: "text-gray-400",
    border: "border-gray-200",
    label: "Cancelled",
  },
};

const SUBJECT_COLOR_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-800",
    border: "border-orange-200",
  },
  teal: {
    bg: "bg-teal-100",
    text: "text-teal-800",
    border: "border-teal-200",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-800",
    border: "border-pink-200",
  },
};

interface CellProps {
  slot: ClassSlot;
  onStatusChange: (slotId: string, status: AttendanceStatus) => void;
}

function ClassCell({ slot, onStatusChange }: CellProps) {
  const [popupVisible, setPopupVisible] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showPopup = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setPopupVisible(true);
  }, []);

  const scheduleHide = useCallback(() => {
    hideTimerRef.current = setTimeout(() => {
      setPopupVisible(false);
    }, 1000);
  }, []);

  const handleStatusClick = useCallback(
    (status: AttendanceStatus) => {
      onStatusChange(slot.id, status);
      setPopupVisible(false);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    },
    [slot.id, onStatusChange]
  );

  const isCancelled = slot.status === "CANCELLED";
  const baseStyles = slot.status
    ? STATUS_STYLES[slot.status]
    : (SUBJECT_COLOR_STYLES[slot.subjectColor] ?? SUBJECT_COLOR_STYLES.blue);

  return (
    <div
      className="relative"
      onMouseEnter={showPopup}
      onMouseLeave={scheduleHide}
    >
      <div
        className={cn(
          "rounded-lg border p-2 text-left cursor-pointer transition-all duration-150 hover:shadow-md",
          baseStyles.bg,
          baseStyles.text,
          baseStyles.border,
          isCancelled && "opacity-50"
        )}
      >
        <p className="font-medium text-xs leading-tight truncate max-w-24">
          {slot.subject}
        </p>
        {slot.room && (
          <p className="text-[10px] opacity-70 mt-0.5">{slot.room}</p>
        )}
        {slot.status && (
          <span
            className={cn(
              "inline-block mt-1 text-[9px] font-bold uppercase tracking-wide px-1 py-0.5 rounded",
              slot.status === "PRESENT" && "bg-green-200 text-green-700",
              slot.status === "ABSENT" && "bg-red-200 text-red-700",
              slot.status === "LATE" && "bg-amber-200 text-amber-700",
              slot.status === "CANCELLED" && "bg-gray-200 text-gray-500"
            )}
          >
            {slot.status[0]}
          </span>
        )}
      </div>

      {/* Hover Popup */}
      {popupVisible && (
        <div
          className="absolute z-50 top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-1 pt-1"
          onMouseEnter={showPopup}
          onMouseLeave={scheduleHide}
        >
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex items-center gap-1 min-w-max">
            <span className="text-[10px] text-gray-500 font-medium mr-1">
              {slot.subject}
            </span>
            {(["PRESENT", "LATE", "ABSENT", "CANCELLED"] as const).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => handleStatusClick(s)}
                  className={cn(
                    "w-7 h-7 rounded-lg text-[10px] font-bold border transition-all duration-100",
                    "hover:scale-110 active:scale-95",
                    slot.status === s
                      ? cn(
                          "ring-2 ring-offset-1",
                          s === "PRESENT" &&
                            "bg-green-500 text-white border-green-500 ring-green-400",
                          s === "ABSENT" &&
                            "bg-red-500 text-white border-red-500 ring-red-400",
                          s === "LATE" &&
                            "bg-amber-500 text-white border-amber-500 ring-amber-400",
                          s === "CANCELLED" &&
                            "bg-gray-400 text-white border-gray-400 ring-gray-300"
                        )
                      : cn(
                          s === "PRESENT" &&
                            "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                          s === "ABSENT" &&
                            "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
                          s === "LATE" &&
                            "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
                          s === "CANCELLED" &&
                            "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        )
                  )}
                  title={
                    s === "PRESENT"
                      ? "Present"
                      : s === "ABSENT"
                      ? "Absent"
                      : s === "LATE"
                      ? "Late"
                      : "Cancelled"
                  }
                >
                  {s[0]}
                </button>
              )
            )}
          </div>
          {/* Arrow */}
          <div className="w-3 h-3 bg-white border-b border-r border-gray-200 rotate-45 mx-auto -mt-1.5 shadow-sm" />
        </div>
      )}
    </div>
  );
}

interface AttendanceGridProps {
  weekDays: WeekDay[];
  timeSlots: string[];
  getSlot: (dayIndex: number, time: string) => ClassSlot | undefined;
  onStatusChange: (slotId: string, status: AttendanceStatus) => void;
}

export function AttendanceGrid({
  weekDays,
  timeSlots,
  getSlot,
  onStatusChange,
}: AttendanceGridProps) {
  return (
    <div className="overflow-auto rounded-xl border border-blue-100 shadow-sm">
      <table className="text-sm border-collapse" style={{ minWidth: "900px" }}>
        <thead>
          <tr className="bg-blue-50 border-b border-blue-100">
            {/* Sticky day column header */}
            <th className="sticky left-0 z-20 bg-blue-50 text-left px-4 py-3 font-semibold text-gray-600 w-28 min-w-[112px] border-r border-blue-100">
              Day / Date
            </th>
            {timeSlots.map((time) => (
              <th
                key={time}
                className="text-center px-2 py-3 font-semibold text-gray-500 text-xs min-w-[110px]"
              >
                {formatTimeLabel(time)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekDays.map((day, dayIndex) => (
            <tr
              key={day.label}
              className="border-b border-gray-100 hover:bg-blue-50/20 transition-colors"
            >
              {/* Sticky day cell */}
              <td className="sticky left-0 z-10 bg-white border-r border-gray-100 px-4 py-2 min-w-[112px]">
                <p className="font-semibold text-gray-800 text-sm">
                  {day.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{day.dateStr}</p>
              </td>
              {timeSlots.map((time) => {
                const slot = getSlot(dayIndex, time);
                return (
                  <td
                    key={time}
                    className="px-2 py-2 text-center align-middle"
                  >
                    {slot ? (
                      <ClassCell slot={slot} onStatusChange={onStatusChange} />
                    ) : (
                      <div className="h-12" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatTimeLabel(time: string): string {
  const [hourStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}:00 ${suffix}`;
}
