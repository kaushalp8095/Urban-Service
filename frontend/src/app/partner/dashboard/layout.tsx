import Link from 'next/link';
import { Home, Calendar, Wallet, Settings, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PartnerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/partner/dashboard" className="text-xl font-bold tracking-tight">
            Partner<span className="text-primary">Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/partner/dashboard" className="flex items-center px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium">
            <Home className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link href="/partner/jobs" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Calendar className="w-5 h-5 mr-3" /> My Jobs
          </Link>
          <Link href="/partner/earnings" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Wallet className="w-5 h-5 mr-3" /> Earnings
          </Link>
          <Link href="/partner/settings" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
              RA
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Rahul AC Services</p>
              <p className="text-xs text-slate-400">4.8 ★</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
            <span className="font-bold ml-2">Partner Panel</span>
          </div>
          <div className="hidden md:block text-lg font-semibold">Overview</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              Online
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
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
