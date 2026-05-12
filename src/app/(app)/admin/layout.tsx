import { AdminSubNav } from "@/components/admin/admin-sub-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-full w-full bg-background -m-4 md:-m-6">
      {/* Admin Horizontal Sub-Nav */}
      <AdminSubNav />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full bg-background">
          <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
      </main>
    </div>
  );
}
