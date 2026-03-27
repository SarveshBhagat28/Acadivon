"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavigationProps {
  weekRangeLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

export function WeekNavigation({
  weekRangeLabel,
  onPrev,
  onNext,
}: WeekNavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={onPrev} aria-label="Previous week">
        <ChevronLeft size={16} />
      </Button>
      <span className="text-sm font-medium text-gray-600 px-3 min-w-[180px] text-center">
        {weekRangeLabel}
      </span>
      <Button variant="outline" size="icon" onClick={onNext} aria-label="Next week">
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
