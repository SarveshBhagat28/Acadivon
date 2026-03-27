import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - Acadivon",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F0FF] via-white to-[#E0F0FF] flex items-center justify-center p-4">
      {children}
    </div>
  );
}
