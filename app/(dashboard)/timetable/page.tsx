"use client";

import { useState } from "react";
import { BarChart2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeekNavigation } from "@/components/attendance/WeekNavigation";
import { AttendanceGrid } from "@/components/attendance/AttendanceGrid";
import { AnalysisPanel } from "@/components/attendance/AnalysisPanel";
import { ImageUpload } from "@/components/attendance/ImageUpload";
import { useAttendance } from "@/hooks/useAttendance";
import type { ScannedClass } from "@/components/attendance/types";

export default function TimetablePage() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const {
    weekDays,
    weekRangeLabel,
    timeSlots,
    getSlot,
    updateStatus,
    applyScannedData,
    analysisSummary,
    overallStats,
    goToPrevWeek,
    goToNextWeek,
  } = useAttendance();

  const handleScannedData = (classes: ScannedClass[]) => {
    applyScannedData(classes);
    setShowUpload(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-gray-900">
          Timetable &amp; Attendance
        </h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Week navigation */}
          <WeekNavigation
            weekRangeLabel={weekRangeLabel}
            onPrev={goToPrevWeek}
            onNext={goToNextWeek}
          />

          {/* Upload toggle */}
          <Button
            variant={showUpload ? "default" : "outline"}
            size="sm"
            onClick={() => setShowUpload((v) => !v)}
          >
            <Upload size={14} />
            Upload
          </Button>

          {/* Analysis panel toggle */}
          <Button
            variant={showAnalysis ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAnalysis((v) => !v)}
          >
            <BarChart2 size={14} />
            Analysis
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <LegendItem color="bg-green-500" label="Present (P)" />
        <LegendItem color="bg-red-500" label="Absent (A)" />
        <LegendItem color="bg-amber-400" label="Late (L)" />
        <LegendItem color="bg-gray-300" label="Cancelled (C)" />
        <span className="text-gray-400 text-[11px]">
          Hover a class to mark attendance
        </span>
      </div>

      {/* Image upload panel */}
      {showUpload && (
        <ImageUpload
          onDataExtracted={handleScannedData}
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex gap-4 items-start">
        {/* Grid takes remaining space */}
        <div className="flex-1 min-w-0">
          <AttendanceGrid
            weekDays={weekDays}
            timeSlots={timeSlots}
            getSlot={getSlot}
            onStatusChange={updateStatus}
          />
        </div>

        {/* Analysis panel (right side, toggle-able) */}
        {showAnalysis && (
          <AnalysisPanel
            summary={analysisSummary}
            overallStats={overallStats}
            onClose={() => setShowAnalysis(false)}
          />
        )}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}

