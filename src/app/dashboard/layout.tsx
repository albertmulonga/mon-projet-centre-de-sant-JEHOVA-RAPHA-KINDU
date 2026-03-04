import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="main-content flex-1">
        {children}
      </div>
    </div>
  );
}
