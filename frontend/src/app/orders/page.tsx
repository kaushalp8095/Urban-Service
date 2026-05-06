'use client';

import { useMyBookings } from '@/lib/api/hooks';
import { Clock, MapPin, Calendar, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrdersPage() {
  const { data, isLoading, isError } = useMyBookings();
  const bookings = data?.data || [];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'text-orange-600 bg-orange-100';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100';
      case 'COMPLETED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-3" />
            Failed to load bookings. Please make sure you are logged in.
            <Link href="/login" className="ml-4 underline font-medium">Login Now</Link>
          </div>
        )}

        {!isLoading && !isError && bookings.length === 0 && (
          <div className="bg-white p-12 rounded-2xl text-center border shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
            <p className="text-muted-foreground mb-8">You haven't booked any services yet.</p>
            <Link href="/">
              <Button size="lg">Explore Services</Button>
            </Link>
          </div>
        )}

        {!isLoading && !isError && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                      <h3 className="text-xl font-bold mt-3 capitalize">
                        {booking.package?.service?.name || 'Service'} - {booking.package?.name || 'Package'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{booking.total_amount}</div>
                      <div className="text-sm text-muted-foreground mt-1">Paid via Online</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                    <div className="flex items-start text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                      <div>
                        <div className="font-medium text-black">Scheduled For</div>
                        <div>{new Date(booking.slot_datetime).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="flex items-start text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400 shrink-0" />
                      <div>
                        <div className="font-medium text-black">Service Address</div>
                        <div className="line-clamp-2">
                          {booking.address?.line1}, {booking.address?.city}
                        </div>
                      </div>
                    </div>
                  </div>

                  {booking.partner && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center border border-blue-100">
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 mr-4">
                        {booking.partner.name?.[0] || 'P'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-blue-900">Professional Assigned</div>
                        <div className="text-xs text-blue-700">{booking.partner.name}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Booking ID: #{booking.id.split('-')[0]}</span>
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
