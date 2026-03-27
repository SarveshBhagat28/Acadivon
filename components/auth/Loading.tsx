"use client";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Signing you in…" }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4" role="status" aria-live="polite">
      {/* Spinner */}
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-200" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 animate-spin" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
