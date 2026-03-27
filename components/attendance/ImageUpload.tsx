"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, CheckCircle, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ScannedTimetableData, ScannedClass } from "./types";

interface ImageUploadProps {
  onDataExtracted: (classes: ScannedClass[]) => void;
  onClose: () => void;
}

const BATCHES = [
  "Batch A",
  "Batch B",
  "Batch C",
  "Batch D",
  "Batch E",
  "Batch F",
];

const DAY_SHORT: Record<number, string> = {
  0: "Mon",
  1: "Tue",
  2: "Wed",
  3: "Thu",
  4: "Fri",
  5: "Sat",
};

export function ImageUpload({ onDataExtracted, onClose }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [batch, setBatch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedTimetableData | null>(
    null
  );
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, etc.)");
      return;
    }
    setSelectedFile(file);
    setError(null);
    setScannedData(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleScan = async () => {
    if (!selectedFile || !preview) return;
    setLoading(true);
    setError(null);

    try {
      // Convert image to base64 (strip the data URL prefix)
      const base64 = preview.split(",")[1];
      const mimeType = selectedFile.type;

      const response = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType, batch: batch || undefined }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Failed to scan image");
      }

      setScannedData(result.data as ScannedTimetableData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (scannedData?.classes) {
      onDataExtracted(scannedData.classes);
      onClose();
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setScannedData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={16} className="text-blue-600" />
          <h3 className="font-semibold text-gray-900 text-sm">
            AI Timetable Scanner
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
          aria-label="Close image upload"
        >
          <X size={14} />
        </Button>
      </div>

      <p className="text-xs text-gray-500">
        Upload an attendance sheet or timetable image. Our AI will extract the
        schedule and populate your grid automatically.
      </p>

      {/* Batch selector (optional) */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Batch{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          {BATCHES.map((b) => (
            <button
              key={b}
              onClick={() => setBatch(batch === b ? "" : b)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-lg border transition-all duration-100",
                batch === b
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              )}
            >
              {b}
            </button>
          ))}
          <input
            type="text"
            placeholder="Custom batch..."
            value={BATCHES.includes(batch) ? "" : batch}
            onChange={(e) => setBatch(e.target.value)}
            className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-200 min-w-[120px]"
          />
        </div>
      </div>

      {/* Drop zone */}
      {!preview ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-all duration-150 cursor-pointer",
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload
            size={24}
            className={cn(
              "mx-auto mb-2 transition-colors",
              dragOver ? "text-blue-500" : "text-gray-300"
            )}
          />
          <p className="text-sm text-gray-500">
            Drop your image here or{" "}
            <span className="text-blue-600 font-medium">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supports JPG, PNG, WEBP
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Selected timetable"
            className="w-full max-h-48 object-contain rounded-xl border border-gray-200 bg-gray-50"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
          {selectedFile && (
            <p className="text-xs text-gray-400 mt-1 truncate">
              {selectedFile.name}
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Scanned results preview */}
      {scannedData && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <CheckCircle size={14} className="text-green-600" />
            <p className="text-xs font-semibold text-green-700">
              Extracted {scannedData.classes.length} class slot
              {scannedData.classes.length !== 1 ? "s" : ""}
              {scannedData.batch && ` for ${scannedData.batch}`}
            </p>
          </div>
          <div className="max-h-28 overflow-y-auto space-y-1">
            {scannedData.classes.map((cls, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[11px] text-gray-600"
              >
                <span className="font-medium text-gray-800 truncate flex-1">
                  {cls.subject}
                </span>
                {cls.room && (
                  <span className="text-gray-400 shrink-0">{cls.room}</span>
                )}
                <span className="text-gray-400 shrink-0">
                  {DAY_SHORT[cls.dayOfWeek] ?? `Day${cls.dayOfWeek}`}{" "}
                  {cls.startTime}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!scannedData ? (
          <Button
            onClick={handleScan}
            disabled={!selectedFile || loading}
            className="flex-1 text-sm"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Scanning…
              </>
            ) : (
              <>
                <Upload size={14} />
                Scan with AI
              </>
            )}
          </Button>
        ) : (
          <>
            <Button onClick={handleApply} className="flex-1 text-sm">
              <CheckCircle size={14} />
              Apply to Grid
            </Button>
            <Button
              variant="outline"
              onClick={() => setScannedData(null)}
              className="text-sm"
            >
              Re-scan
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
