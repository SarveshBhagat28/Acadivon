import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const sampleClasses = [
  { day: 0, time: "8:00", subject: "Mathematics", room: "LH-101", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { day: 0, time: "10:00", subject: "Physics", room: "LH-203", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { day: 1, time: "9:00", subject: "Data Structures", room: "CS-Lab", color: "bg-green-100 text-green-800 border-green-200" },
  { day: 1, time: "14:00", subject: "Machine Learning", room: "LH-305", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { day: 2, time: "8:00", subject: "Mathematics", room: "LH-101", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { day: 2, time: "11:00", subject: "Algorithms", room: "CS-Lab", color: "bg-teal-100 text-teal-800 border-teal-200" },
  { day: 3, time: "9:00", subject: "Physics", room: "LH-203", color: "bg-purple-100 text-purple-800 border-purple-200" },
  { day: 3, time: "15:00", subject: "Machine Learning", room: "LH-305", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { day: 4, time: "8:00", subject: "Data Structures", room: "CS-Lab", color: "bg-green-100 text-green-800 border-green-200" },
  { day: 4, time: "10:00", subject: "Algorithms", room: "CS-Lab", color: "bg-teal-100 text-teal-800 border-teal-200" },
  { day: 5, time: "9:00", subject: "Mathematics", room: "LH-101", color: "bg-blue-100 text-blue-800 border-blue-200" },
];

const attendanceSummary = [
  { subject: "Mathematics", present: 18, total: 22, percentage: 82 },
  { subject: "Physics", present: 14, total: 20, percentage: 70 },
  { subject: "Data Structures", present: 20, total: 24, percentage: 83 },
  { subject: "Machine Learning", present: 16, total: 18, percentage: 89 },
  { subject: "Algorithms", present: 15, total: 22, percentage: 68 },
];

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Timetable & Attendance
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm font-medium text-gray-600 px-2">
            March 24 – 29, 2026
          </span>
          <Button variant="outline" size="icon">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Timetable Grid */}
      <Card>
        <CardContent className="p-0 overflow-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="sticky left-0 bg-blue-50 text-left px-4 py-3 font-semibold text-gray-600 w-16">
                  Time
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="text-center px-2 py-3 font-semibold text-gray-600 min-w-[120px]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr
                  key={time}
                  className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                >
                  <td className="sticky left-0 bg-white px-4 py-2 font-medium text-gray-500 text-xs">
                    {time}
                  </td>
                  {days.map((_, dayIndex) => {
                    const cls = sampleClasses.find(
                      (c) => c.day === dayIndex && c.time === time
                    );
                    return (
                      <td key={dayIndex} className="px-2 py-2 text-center">
                        {cls ? (
                          <div
                            className={`rounded-lg border p-2 text-left cursor-pointer hover:shadow-sm transition-shadow ${cls.color}`}
                          >
                            <p className="font-medium text-xs leading-tight">
                              {cls.subject}
                            </p>
                            <p className="text-xs opacity-70 mt-0.5">
                              {cls.room}
                            </p>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              Attendance Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceSummary.map((item) => (
                <div key={item.subject} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700 w-36 shrink-0">
                    {item.subject}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.percentage >= 75
                          ? "bg-green-500"
                          : item.percentage >= 65
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-10 text-right">
                    {item.percentage}%
                  </span>
                  <Badge
                    variant={
                      item.percentage >= 75
                        ? "success"
                        : item.percentage >= 65
                        ? "warning"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {item.present}/{item.total}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">75% Tracker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {attendanceSummary
              .filter((s) => s.percentage < 75)
              .map((item) => {
                const needed = Math.ceil(
                  (0.75 * item.total - item.present) / 0.25
                );
                return (
                  <div
                    key={item.subject}
                    className="p-3 rounded-xl bg-red-50 border border-red-100"
                  >
                    <p className="text-sm font-semibold text-red-700">
                      {item.subject}
                    </p>
                    <p className="text-xs text-red-500 mt-0.5">
                      Attend {needed} more classes to reach 75%
                    </p>
                  </div>
                );
              })}
            {attendanceSummary.filter((s) => s.percentage < 75).length ===
              0 && (
              <p className="text-sm text-green-600 font-medium text-center py-4">
                🎉 All subjects above 75%!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
