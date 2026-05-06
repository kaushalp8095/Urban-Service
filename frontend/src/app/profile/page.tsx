'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, Phone, Wallet, Settings, LogOut, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setUserPhone(localStorage.getItem('userPhone') || '');
    setUserName(localStorage.getItem('userName') || 'UrbanService User');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start font-medium text-primary bg-blue-50 hover:bg-blue-100">
              <User className="w-4 h-4 mr-3" /> Personal Info
            </Button>
            <Link href="/orders">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-black">
                <Calendar className="w-4 h-4 mr-3" /> My Bookings
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-black">
              <Settings className="w-4 h-4 mr-3" /> Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-black">
              <Wallet className="w-4 h-4 mr-3" /> UC Wallet
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-3" /> Logout
            </Button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                  <div className="flex items-center text-lg font-medium">
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    {userName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                  <div className="flex items-center text-lg font-medium">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    +91 {userPhone}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <Button variant="outline" onClick={() => alert('Profile editing coming soon!')}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
