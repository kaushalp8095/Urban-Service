import Link from 'next/link';
import { LayoutDashboard, Users, FileCheck, Layers, BarChart3, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
            Super<span className="text-primary">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Overview
          </Link>
          <Link href="/admin/users" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-3" /> Customers
          </Link>
          <Link href="/admin/partners" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <FileCheck className="w-5 h-5 mr-3" /> Partner KYC
          </Link>
          <Link href="/admin/dashboard/services" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Layers className="w-5 h-5 mr-3" /> Services
          </Link>
          <Link href="/admin/analytics" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <BarChart3 className="w-5 h-5 mr-3" /> Analytics
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
            <span className="font-bold ml-2">Admin Panel</span>
          </div>
          <div className="hidden md:block text-lg font-semibold">Command Center</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium">Admin User</div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
