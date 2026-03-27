"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BrainCircuit,
  BookOpen,
  BarChart3,
  Timer,
  Settings,
  Users,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Timetable & Attendance", href: "/timetable", icon: Calendar },
  { label: "AI Hub", href: "/ai-hub", icon: BrainCircuit },
  { label: "Assignments", href: "/assignments", icon: BookOpen },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Study Tracker", href: "/study-tracker", icon: Timer },
  { label: "Settings", href: "/settings", icon: Settings },
  {
    label: "Community",
    href: "/community",
    icon: Users,
    locked: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-blue-100 shadow-sm z-40 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-blue-100">
        <Image
          src="/logo.svg"
          alt="Acadivon logo"
          width={36}
          height={36}
          className="rounded-xl object-contain shadow"
          priority
        />
        <span className="text-xl font-bold text-gray-900 tracking-tight">
          Acadivon
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.locked ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-700",
                item.locked && "opacity-60 cursor-not-allowed"
              )}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              <span className="flex-1">{item.label}</span>
              {item.locked && (
                <Lock size={14} className="shrink-0 opacity-70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-100 text-xs text-gray-400 text-center">
        Acadivon v0.1.0
      </div>
    </aside>
  );
}
