"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { AssignmentStatus, Priority } from "@prisma/client";
import { CalendarClock, Plus, Search } from "lucide-react";
import { auth } from "@/lib/auth/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAssignmentDisplayStatus,
  getCountdownLabel,
} from "@/lib/assignments/status";
import { useNotifications } from "@/components/notifications/NotificationProvider";

type AssignmentItem = {
  id: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: AssignmentStatus;
  priority: Priority;
  createdAt: string;
};

type FilterStatus = "ALL" | "PENDING" | "COMPLETED" | "OVERDUE";
type FilterPriority = "ALL" | "LOW" | "MEDIUM" | "HIGH";

const defaultForm = {
  title: "",
  description: "",
  dueDate: "",
  dueTime: "23:59",
  priority: "MEDIUM" as FilterPriority,
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>("ALL");
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const { fetchNotifications } = useNotifications();

  async function getAuthToken() {
    const user = auth?.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }

  const loadAssignments = useCallback(async () => {
    try {
      setLoading(true);
      const idToken = await getAuthToken();
      if (!idToken) {
        setAssignments([]);
        return;
      }

      const res = await fetch("/api/assignments", {
        headers: { Authorization: `Bearer ${idToken}` },
        cache: "no-store",
      });
      if (!res.ok) return;

      const payload = (await res.json()) as { data?: AssignmentItem[] };
      setAssignments(payload.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAssignments();
  }, [loadAssignments]);

  const filteredAssignments = useMemo(() => {
    const q = search.toLowerCase().trim();

    return assignments.filter((assignment) => {
      const dueDate = new Date(assignment.dueDate);
      const displayStatus = getAssignmentDisplayStatus(assignment.status, dueDate);
      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "PENDING" && displayStatus === "Pending") ||
        (statusFilter === "COMPLETED" && displayStatus === "Completed") ||
        (statusFilter === "OVERDUE" && displayStatus === "Overdue");

      const priorityMatch =
        priorityFilter === "ALL" || assignment.priority === priorityFilter;

      const searchMatch =
        q.length === 0 ||
        assignment.title.toLowerCase().includes(q) ||
        (assignment.description ?? "").toLowerCase().includes(q);

      return statusMatch && priorityMatch && searchMatch;
    });
  }, [assignments, priorityFilter, search, statusFilter]);

  async function handleCreateAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.description.trim() || !form.dueDate || !form.dueTime) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const [year, month, day] = form.dueDate.split("-").map(Number);
    const [hours, minutes] = form.dueTime.split(":").map(Number);
    if (
      !year ||
      !month ||
      !day ||
      Number.isNaN(hours) ||
      Number.isNaN(minutes)
    ) {
      setFormError("Please provide a valid due date and time.");
      return;
    }

    const localDue = new Date(year, month - 1, day, hours, minutes, 0, 0);
    if (Number.isNaN(localDue.getTime())) {
      setFormError("Please provide a valid due date and time.");
      return;
    }

    try {
      setSaving(true);
      const idToken = await getAuthToken();
      if (!idToken) {
        setFormError("Please login to create assignments.");
        return;
      }

      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          dueDate: localDue.toISOString(),
          priority: form.priority,
        }),
      });

      const payload = (await res.json()) as { success: boolean; error?: string; data?: AssignmentItem };
      if (!res.ok || !payload.success || !payload.data) {
        setFormError(payload.error ?? "Unable to create assignment.");
        return;
      }
      const createdAssignment = payload.data;

      setAssignments((prev) => {
        const next = [createdAssignment, ...prev];
        next.sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        return next;
      });

      setForm(defaultForm);
      setModalOpen(false);
      await fetchNotifications();
    } finally {
      setSaving(false);
    }
  }

  async function markCompleted(assignmentId: string) {
    const idToken = await getAuthToken();
    if (!idToken) return;

    const res = await fetch(`/api/assignments/${assignmentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ status: "SUBMITTED" }),
    });

    if (!res.ok) return;

    setAssignments((prev) =>
      prev.map((item) =>
        item.id === assignmentId ? { ...item, status: "SUBMITTED" } : item
      )
    );
    await fetchNotifications();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={14} />
            New ▼
          </Button>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search assignments"
              className="pl-8"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as FilterStatus)}
            className="h-9 rounded-xl border border-blue-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as FilterPriority)}
            className="h-9 rounded-xl border border-blue-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6 text-sm text-gray-500">Loading assignments...</CardContent>
        </Card>
      ) : filteredAssignments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-gray-500">No assignments yet</CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => {
            const dueDate = new Date(assignment.dueDate);
            const displayStatus = getAssignmentDisplayStatus(assignment.status, dueDate);

            return (
              <Card key={assignment.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg text-blue-900">{assignment.title}</CardTitle>
                    <Badge variant={displayStatus === "Completed" ? "success" : displayStatus === "Overdue" ? "destructive" : "warning"}>
                      {displayStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-3">{assignment.description}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarClock size={14} className="text-blue-600" />
                    <span>{dueDate.toLocaleString()}</span>
                  </div>

                  <p className="text-sm font-medium text-blue-700">{getCountdownLabel(dueDate)}</p>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <Badge
                      variant="outline"
                      className={
                        assignment.priority === "HIGH"
                          ? "border-red-200 text-red-700"
                          : assignment.priority === "MEDIUM"
                            ? "border-yellow-200 text-yellow-700"
                            : "border-green-200 text-green-700"
                      }
                    >
                      {assignment.priority}
                    </Badge>

                    {displayStatus !== "Completed" && (
                      <Button size="sm" variant="outline" onClick={() => void markCompleted(assignment.id)}>
                        Mark completed
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 flex items-center justify-center">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>New Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateAssignment}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor="title">
                    Title *
                  </label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor="description">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                    required
                    className="min-h-28 w-full rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700" htmlFor="dueDate">
                      Due Date *
                    </label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={form.dueDate}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, dueDate: event.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700" htmlFor="dueTime">
                      Due Time *
                    </label>
                    <Input
                      id="dueTime"
                      type="time"
                      value={form.dueTime}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, dueTime: event.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700" htmlFor="priority">
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={form.priority}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        priority: event.target.value as FilterPriority,
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-blue-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                {formError && <p className="text-sm text-red-600">{formError}</p>}

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setModalOpen(false);
                      setFormError("");
                      setForm(defaultForm);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Create Assignment"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
