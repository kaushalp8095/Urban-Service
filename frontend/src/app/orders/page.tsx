"use client";

import { useMyBookings, useCreateReview } from '@/lib/api/hooks';
import { Clock, MapPin, Calendar, CheckCircle2, ChevronRight, AlertCircle, Loader2, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

export default function OrdersPage() {
  const { data, isLoading, isError, refetch } = useMyBookings();
  const bookings = data?.data || [];
  
  const [reviewingBooking, setReviewingBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const createReviewMutation = useCreateReview();

  const handleReviewSubmit = async () => {
    try {
      await createReviewMutation.mutateAsync({
        bookingId: reviewingBooking.id,
        rating,
        comment
      });
      setReviewingBooking(null);
      setRating(5);
      setComment('');
      refetch();
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  const getStatusColor = (status: string) => {
    // ... same as before
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {/* ... Loading and Error states same as before ... */}

        {!isLoading && !isError && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  {/* ... Header and details same as before ... */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${booking.status === 'COMPLETED' ? 'text-green-600 bg-green-100' : booking.status === 'CANCELLED' ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'}`}>
                        {booking.status}
                      </span>
                      <h3 className="text-xl font-bold mt-3 capitalize">
                        {booking.package?.service?.name || 'Service'} - {booking.package?.name || 'Package'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{booking.total_amount}</div>
                    </div>
                  </div>

                  {/* ... Booking Info Grid ... */}
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

                  {/* Review Section */}
                  {booking.status === 'COMPLETED' && !booking.reviews?.[0] && (
                    <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                      <h4 className="font-bold text-amber-900 mb-2">How was your service?</h4>
                      <p className="text-sm text-amber-700 mb-4">Your feedback helps us maintain top-quality standards.</p>
                      <Button onClick={() => setReviewingBooking(booking)} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8">
                        Rate Service
                      </Button>
                    </div>
                  )}

                  {booking.reviews?.[0] && (
                    <div className="mt-8 p-5 bg-gray-50 rounded-2xl border flex items-start gap-4">
                      <div className="bg-white p-2 rounded-lg border text-amber-500 font-bold flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500" /> {booking.reviews[0].rating}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">Your Review</p>
                        <p className="text-sm text-gray-600 italic mt-1">"{booking.reviews[0].comment || 'No comment provided'}"</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Booking ID: #{booking.id.split('-')[0]}</span>
                  <Link href={`/helpcenter?bookingId=${booking.id}`} className="text-primary font-bold hover:underline">
                    Get Help
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewingBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Rate Professional</h3>
                <button onClick={() => setReviewingBooking(null)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div className="p-8 text-center">
                <div className="flex justify-center gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)}>
                      <Star className={`w-10 h-10 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
                <textarea 
                  className="w-full border-2 rounded-2xl p-4 text-sm focus:border-primary outline-none transition-colors"
                  rows={4}
                  placeholder="Tell us about your experience (optional)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button 
                  onClick={handleReviewSubmit}
                  disabled={createReviewMutation.isPending}
                  className="w-full h-14 mt-8 rounded-2xl font-bold text-lg"
                >
                  {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
