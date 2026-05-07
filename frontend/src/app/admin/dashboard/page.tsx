'use client';

import { Users, CreditCard, Activity, UserPlus, Loader2, AlertCircle, TrendingUp, Download } from 'lucide-react';
import { useAdminStats, useAdminBookings } from '@/lib/api/hooks';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { data: statsData, isLoading: isLoadingStats } = useAdminStats();
  const { data: bookingsData, isLoading: isLoadingBookings } = useAdminBookings();

  const stats = statsData?.data;
  const bookings = bookingsData?.data || [];

  if (isLoadingStats || isLoadingBookings) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Platform Overview</h2>
          <p className="text-muted-foreground">Real-time performance metrics across India.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <select className="border rounded-lg px-4 py-2 text-sm font-semibold bg-white shadow-sm outline-none focus:ring-2 focus:ring-primary/20">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>All Time</option>
          </select>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">LIVE</span>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Revenue</p>
          <p className="text-3xl font-black mt-1">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
          <div className="mt-4 flex items-center text-xs font-bold text-green-600">
             <TrendingUp className="w-3 h-3 mr-1" /> +12% vs last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Bookings</p>
          <p className="text-3xl font-black mt-1">{stats?.totalBookings || 0}</p>
          <div className="mt-4 flex items-center text-xs font-bold text-orange-600">
             Active right now: {bookings.filter((b: any) => b.status !== 'COMPLETED').length}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Registered Users</p>
          <p className="text-3xl font-black mt-1">{stats?.totalUsers || 0}</p>
           <div className="mt-4 flex items-center text-xs font-bold text-purple-600">
             Verified Customers
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Partners</p>
          <p className="text-3xl font-black mt-1">{stats?.totalPartners || 0}</p>
          <div className="mt-4 flex items-center text-xs font-bold text-green-600">
             Ready for jobs
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-black text-xl">Recent Global Bookings</h3>
          <Button variant="ghost" size="sm" className="font-bold text-primary">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-8 py-5 font-black">Booking Details</th>
                <th className="px-8 py-5 font-black">Customer</th>
                <th className="px-8 py-5 font-black">Partner</th>
                <th className="px-8 py-5 font-black">Status</th>
                <th className="px-8 py-5 font-black">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length > 0 ? bookings.map((booking: any) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-gray-900 group-hover:text-blue-600 cursor-pointer">#{booking.id.split('-')[0].toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">{booking.package.service.name}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{format(new Date(booking.created_at), 'MMM d, p')}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-bold">{booking.user.name}</div>
                    <div className="text-xs text-muted-foreground">{booking.user.phone}</div>
                  </td>
                  <td className="px-8 py-5">
                    {booking.partner ? (
                      <div>
                        <div className="font-bold">{booking.partner.user.name}</div>
                        <div className="text-[10px] bg-blue-50 text-blue-700 inline-block px-1.5 py-0.5 rounded font-black mt-1">ID: {booking.partner_id.split('-')[0].toUpperCase()}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded">PENDING MATCH</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-full ${
                      booking.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="font-black text-gray-900 text-base">₹{booking.total_amount}</div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-muted-foreground italic">No bookings found in the platform.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
