"use client";

import Link from "next/link";
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
import { Logo } from "@/components/Logo";
import { brandConfig } from "@/lib/branding";

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
  const sidebarStyle = { backgroundColor: brandConfig.sidebarColor };

  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 shadow-lg z-40 flex flex-col"
      style={sidebarStyle}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 p-6 border-b border-white/10 sticky top-0 z-10"
        style={sidebarStyle}
      >
        <Logo size="md" variant="white" linkTo="/dashboard" />
        <span className="text-xl font-bold text-white tracking-tight">
          Acadivon
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.locked ? "#" : item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-500/30 text-white shadow-sm border border-blue-400/30"
                  : "text-blue-100/80 hover:bg-white/10 hover:text-white",
                item.locked && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" size={20} />
              <span className="flex-1">{item.label}</span>
              {item.locked && (
                <Lock size={14} className="shrink-0 opacity-70" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-blue-200/60 text-center">
        {brandConfig.name} v{brandConfig.version}
      </div>
    </aside>
  );
}
