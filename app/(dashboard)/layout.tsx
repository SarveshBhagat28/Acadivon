import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { NotificationProvider } from "@/components/notifications/NotificationProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#E0F0FF]">
      <NotificationProvider>
        <Sidebar />
        <div className="ml-64">
          <Header />
          <main className="pt-16 p-6 min-h-screen">{children}</main>
        </div>
      </NotificationProvider>
    </div>
  );
}
