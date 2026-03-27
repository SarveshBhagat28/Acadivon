"use client";

import Image from "next/image";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
}

export function Header({ title = "Dashboard" }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-blue-100 shadow-sm z-30 flex items-center justify-between px-6">
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <Image
          src="/acadivon-logo.png"
          alt="Acadivon logo"
          width={32}
          height={32}
          className="rounded-lg object-contain"
          priority
        />
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

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
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

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
