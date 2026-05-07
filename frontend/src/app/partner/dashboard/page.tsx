'use client';

import { TrendingUp, CheckCircle, Clock, MapPin, Phone, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePartnerStats, usePartnerBookings, useUpdateBookingStatus } from '@/lib/api/hooks';
import { format } from 'date-fns';

export default function PartnerDashboard() {
  const { data: statsData, isLoading: isLoadingStats } = usePartnerStats();
  const { data: bookingsData, isLoading: isLoadingBookings, refetch } = usePartnerBookings();
  const updateStatusMutation = useUpdateBookingStatus();

  const stats = statsData?.data;
  const bookings = bookingsData?.data || [];

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      refetch();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (isLoadingStats || isLoadingBookings) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const upcomingBookings = bookings.filter((b: any) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');
  const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">THIS MONTH</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
          <p className="text-3xl font-black mt-1">₹{stats?.totalEarnings || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Jobs Completed</p>
          <p className="text-3xl font-black mt-1">{stats?.jobsCompleted || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <span className="text-amber-500 text-xl font-bold">★</span>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Partner Rating</p>
          <p className="text-3xl font-black mt-1">{stats?.rating || '0.0'}</p>
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black">Active Assignments</h2>
          <span className="text-sm font-medium text-muted-foreground">{upcomingBookings.length} bookings remaining</span>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {upcomingBookings.map((booking: any) => (
              <div key={booking.id} className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm hover:border-blue-100 transition-all">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                        booking.status === 'ASSIGNED' ? 'bg-amber-100 text-amber-700' :
                        booking.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {booking.status}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {format(new Date(booking.slot_datetime), 'PPP')} @ {format(new Date(booking.slot_datetime), 'p')}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{booking.package.service.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{booking.package.name} • {booking.package.duration_min} mins</p>
                    </div>

                    <div className="flex items-start bg-gray-50 p-4 rounded-2xl">
                      <MapPin className="w-4 h-4 text-blue-600 mt-1 mr-3 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{booking.user.name}</p>
                        <p className="text-sm text-gray-600">{typeof booking.address === 'string' ? booking.address : (booking.address?.line1 + ', ' + booking.address?.city)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 min-w-[150px]">
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-600">₹{booking.total_amount}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Est. Payout</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full">
                      {booking.status === 'ASSIGNED' && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}>
                          Start Job
                        </Button>
                      )}
                      {booking.status === 'IN_PROGRESS' && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 font-bold" onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}>
                          Complete Job
                        </Button>
                      )}
                      <Button variant="outline" className="w-full font-bold border-gray-200">
                        <Phone className="w-4 h-4 mr-2" /> Contact User
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl py-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-400">No active assignments</h3>
            <p className="text-sm text-gray-400">Assignments will appear here when a customer books a service.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
