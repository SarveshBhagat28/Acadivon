"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AttendanceSummary } from "./types";

interface AnalysisPanelProps {
  summary: AttendanceSummary[];
  overallStats: {
    present: number;
    absent: number;
    late: number;
    cancelled: number;
    total: number;
    percentage: number;
  };
  onClose: () => void;
}

const SUBJECT_DOT_COLORS: Record<string, string> = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  orange: "bg-orange-500",
  teal: "bg-teal-500",
  pink: "bg-pink-500",
};

export function AnalysisPanel({
  summary,
  overallStats,
  onClose,
}: AnalysisPanelProps) {
  const { present, absent, late, cancelled, total, percentage } = overallStats;

  return (
    <div className="w-72 shrink-0 flex flex-col gap-4 bg-white border border-blue-100 rounded-2xl shadow-sm p-4 h-fit">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">
          Attendance Analysis
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
          aria-label="Close analysis panel"
        >
          <X size={14} />
        </Button>
      </div>

      {/* Overall stats */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
        <p className="text-xs text-blue-600 font-medium mb-2">
          Overall this week
        </p>
        <div className="flex items-end gap-1 mb-3">
          <span
            className={cn(
              "text-3xl font-bold",
              percentage >= 75
                ? "text-green-600"
                : percentage >= 65
                ? "text-amber-500"
                : "text-red-500"
            )}
          >
            {percentage}%
          </span>
          <span className="text-xs text-gray-500 mb-1 ml-1">attendance</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatChip
            label="Present"
            value={present}
            color="green"
            indicator="🟢"
          />
          <StatChip label="Absent" value={absent} color="red" indicator="🔴" />
          <StatChip label="Late" value={late} color="amber" indicator="🟡" />
          <StatChip
            label="Cancelled"
            value={cancelled}
            color="gray"
            indicator="⚪"
          />
        </div>
        {total > 0 && (
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
              {present > 0 && (
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${(present / (total + cancelled)) * 100}%` }}
                />
              )}
              {late > 0 && (
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${(late / (total + cancelled)) * 100}%` }}
                />
              )}
              {absent > 0 && (
                <div
                  className="h-full bg-red-400 transition-all"
                  style={{ width: `${(absent / (total + cancelled)) * 100}%` }}
                />
              )}
              {cancelled > 0 && (
                <div
                  className="h-full bg-gray-300 transition-all"
                  style={{
                    width: `${(cancelled / (total + cancelled)) * 100}%`,
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Per-subject breakdown */}
      <div>
        <p className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wide">
          By Subject
        </p>
        <div className="space-y-2.5">
          {summary.map((item) => (
            <SubjectRow key={item.subject} item={item} />
          ))}
          {summary.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-3">
              No subjects found
            </p>
          )}
        </div>
      </div>

      {/* 75% tracker */}
      {summary.some((s) => s.percentage < 75 && s.total > 0) && (
        <div>
          <p className="text-xs text-red-500 font-medium mb-2 uppercase tracking-wide">
            ⚠ Below 75%
          </p>
          <div className="space-y-2">
            {summary
              .filter((s) => s.percentage < 75 && s.total > 0)
              .map((item) => {
                const needed = Math.ceil(
                  (0.75 * (item.present + item.absent + item.late) -
                    item.present) /
                    0.25
                );
                return (
                  <div
                    key={item.subject}
                    className="p-2.5 rounded-xl bg-red-50 border border-red-100"
                  >
                    <p className="text-xs font-semibold text-red-700">
                      {item.subject}
                    </p>
                    <p className="text-[10px] text-red-500 mt-0.5">
                      Need {needed} more class{needed !== 1 ? "es" : ""} for
                      75%
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
  indicator,
}: {
  label: string;
  value: number;
  color: string;
  indicator: string;
}) {
  return (
    <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1.5 border border-gray-100">
      <span className="text-xs">{indicator}</span>
      <div>
        <p className="text-xs font-bold text-gray-800">{value}</p>
        <p className="text-[10px] text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function SubjectRow({ item }: { item: AttendanceSummary }) {
  const dotColor =
    SUBJECT_DOT_COLORS[item.subjectColor] ?? "bg-blue-500";
  const effectiveTotal = item.present + item.absent + item.late;
  const pct =
    effectiveTotal === 0
      ? 0
      : Math.round((item.present / effectiveTotal) * 100);

  return (
    <div className="flex items-center gap-2">
      <span className={cn("w-2 h-2 rounded-full shrink-0", dotColor)} />
      <span className="text-xs text-gray-700 truncate flex-1 min-w-0">
        {item.subject}
      </span>
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              pct >= 75
                ? "bg-green-500"
                : pct >= 65
                ? "bg-amber-400"
                : "bg-red-400"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <Badge
          variant={
            pct >= 75 ? "success" : pct >= 65 ? "warning" : "destructive"
          }
          className="text-[10px] px-1.5 py-0"
        >
          {pct}%
        </Badge>
      </div>
    </div>
  );
}
