import type { Metadata } from "next";
import "./globals.css";
import { brandConfig } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Acadivon - AI-Powered Education Platform",
  description:
    "Acadivon is an AI-powered education platform for students. Manage timetables, track attendance, get AI tutoring, and optimize your learning.",
  icons: {
    icon: brandConfig.logoPath,
    shortcut: brandConfig.logoPath,
    apple: brandConfig.logoPath,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#E0F0FF] font-sans">{children}</body>
    </html>
  );
}
