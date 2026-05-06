import { Users, CreditCard, Activity, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overview</h2>
        <select className="border rounded-md px-3 py-1 text-sm bg-white">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">₹4,25,000</p>
          <p className="text-xs text-green-600 mt-1 font-medium">+15.2% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Active Bookings</h3>
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">124</p>
          <p className="text-xs text-muted-foreground mt-1">42 pending assignment</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">New Customers</h3>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">+840</p>
          <p className="text-xs text-green-600 mt-1 font-medium">+4% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Partner Signups</h3>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-4">+52</p>
          <p className="text-xs text-orange-600 mt-1 font-medium">18 pending KYC</p>
        </div>

      </div>

      {/* Recent Activity Table (Scaffold) */}
      <div className="bg-white border rounded-xl shadow-sm mt-8">
        <div className="px-6 py-4 border-b">
          <h3 className="font-bold text-lg">Recent Bookings</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">Booking ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer">#UC-8842-19{i}</td>
                  <td className="px-6 py-4">John Doe</td>
                  <td className="px-6 py-4">AC Service - Standard</td>
                  <td className="px-6 py-4">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                      ASSIGNED
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">₹899</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
