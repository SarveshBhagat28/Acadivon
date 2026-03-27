import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acadivon - AI-Powered Education Platform",
  description:
    "Acadivon is an AI-powered education platform for students. Manage timetables, track attendance, get AI tutoring, and optimize your learning.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
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
