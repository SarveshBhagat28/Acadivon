"use client";

import { useState } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotifications } from "@/components/notifications/NotificationProvider";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, bellDot, markAllRead } = useNotifications();

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-blue-100 shadow-sm z-30 flex items-center justify-between px-6">
      {/* Title */}
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search
            className="absolute left-3 text-gray-400 w-4 h-4"
            size={16}
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-blue-50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 w-56"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
            setShowNotifications((prev) => !prev);
            markAllRead();
          }}
        >
          <Bell size={18} />
          {bellDot && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
          {showNotifications && (
            <div className="absolute right-0 top-11 z-50 w-[min(90vw,360px)]">
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">
                    Notifications
                  </p>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No new notifications</p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-auto">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-blue-100 bg-blue-50/50 p-2.5"
                        >
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-600">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Profile */}
        <Button variant="ghost" size="icon">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </Button>
      </div>
    </header>
  );
}
