import { TrendingUp, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PartnerDashboard() {
  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Today's Earnings</h3>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-bold mt-2">₹1,450</p>
          <p className="text-xs text-green-600 mt-1 font-medium">+12% from yesterday</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Jobs Completed</h3>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">3</p>
          <p className="text-xs text-muted-foreground mt-1">2 remaining today</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Overall Rating</h3>
            <span className="text-yellow-500 text-lg leading-none">★</span>
          </div>
          <p className="text-3xl font-bold mt-2">4.8</p>
          <p className="text-xs text-muted-foreground mt-1">Based on 124 reviews</p>
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div>
        <h2 className="text-xl font-bold mb-4">Today's Schedule</h2>
        <div className="space-y-4">
          
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">UPCOMING</span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> 03:00 PM - 04:30 PM
                  </span>
                </div>
                <h3 className="text-lg font-bold">AC Service - Standard Package</h3>
                <p className="text-muted-foreground text-sm mt-1">Booking ID: #UC-8842-192</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">₹899</p>
                <p className="text-xs text-muted-foreground">Est. Payout</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-primary mt-1 mr-2 shrink-0" />
                <p className="text-sm">Flat 402, Sunshine Apartments, Link Road, Andheri West</p>
              </div>
              <div className="flex space-x-2 shrink-0">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" /> Call
                </Button>
                <Button size="sm">Start Job</Button>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
}
