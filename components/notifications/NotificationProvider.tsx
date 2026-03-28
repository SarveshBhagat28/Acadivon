"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth/firebase";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  dueDate?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  bellDot: boolean;
  activePopup: AppNotification | null;
  hidePopup: () => void;
  markAllRead: () => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);
const NOTIFICATION_POLL_INTERVAL_MS = 60_000;

function getInitialReadIds() {
  if (typeof window === "undefined") return new Set<string>();
  const raw = window.localStorage.getItem("acadivon-read-notifications");
  if (!raw) return new Set<string>();
  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set<string>();
  }
}

function saveReadIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    "acadivon-read-notifications",
    JSON.stringify(Array.from(ids))
  );
}

function getInitialNotifiedIds() {
  if (typeof window === "undefined") return new Set<string>();
  const raw = window.localStorage.getItem("acadivon-popup-notified");
  if (!raw) return new Set<string>();
  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set<string>();
  }
}

function saveNotifiedIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("acadivon-popup-notified", JSON.stringify(Array.from(ids)));
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => getInitialReadIds());
  const [activePopup, setActivePopup] = useState<AppNotification | null>(null);
  const popupNotifiedRef = useRef<Set<string>>(getInitialNotifiedIds());

  const fetchNotifications = useCallback(async () => {
    if (!auth?.currentUser) return;

    const idToken = await auth.currentUser.getIdToken();
    const res = await fetch("/api/notifications/assignment-deadlines", {
      headers: { Authorization: `Bearer ${idToken}` },
      cache: "no-store",
    });

    if (!res.ok) return;
    const payload = (await res.json()) as { data?: AppNotification[] };
    const incoming = payload.data ?? [];

    setNotifications(incoming);

    if (typeof document !== "undefined" && document.visibilityState === "visible") {
      const popupCandidate = incoming.find(
        (item) => !popupNotifiedRef.current.has(item.id)
      );
      if (popupCandidate) {
        popupNotifiedRef.current.add(popupCandidate.id);
        saveNotifiedIds(popupNotifiedRef.current);
        setActivePopup(popupCandidate);
      }
    }
  }, []);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged(() => {
      void fetchNotifications();
    });

    const interval = window.setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }
      void fetchNotifications();
    }, NOTIFICATION_POLL_INTERVAL_MS);

    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, [fetchNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !readIds.has(item.id)).length,
    [notifications, readIds]
  );

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((item) => next.add(item.id));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  const value = useMemo<NotificationContextType>(
    () => ({
      notifications,
      unreadCount,
      bellDot: unreadCount > 0,
      activePopup,
      hidePopup: () => setActivePopup(null),
      markAllRead,
      fetchNotifications,
    }),
    [activePopup, fetchNotifications, markAllRead, notifications, unreadCount]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {activePopup && (
        <div className="fixed right-4 top-20 z-50 w-[min(92vw,360px)]">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Bell size={16} className="text-blue-600" />
                  {activePopup.title}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActivePopup(null)}>
                  Close
                </Button>
              </div>
              <p className="text-sm text-gray-700">{activePopup.message}</p>
              {activePopup.dueDate && (
                <Badge variant="warning">
                  Due {new Date(activePopup.dueDate).toLocaleString()}
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
