'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, Phone, Wallet, Settings, LogOut, Calendar, Mail, MapPin, Save, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useProfile, useUpdateProfile } from '@/lib/api/hooks';

export default function ProfilePage() {
  const router = useRouter();
  const { data: profileData, isLoading, refetch } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: ''
  });

  const user = profileData?.data;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    router.push('/');
  };

  const handleUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      refetch();
      // Update local storage too for consistency
      localStorage.setItem('userName', formData.name);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

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
            <Link href="/wallet">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-black">
                <Wallet className="w-4 h-4 mr-3" /> UC Wallet
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-black">
                <Settings className="w-4 h-4 mr-3" /> Settings
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-3" /> Logout
            </Button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Personal Information</h2>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                    <Button size="sm" onClick={handleUpdate} disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : <><Save className="w-4 h-4 mr-1" /> Save</>}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  ) : (
                    <div className="flex items-center text-lg font-medium">
                      <User className="w-5 h-5 mr-3 text-gray-400" />
                      {user?.name || 'UrbanService User'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                  <div className="flex items-center text-lg font-medium text-gray-500">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    +91 {user?.phone}
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="flex items-center text-lg font-medium">
                      <Mail className="w-5 h-5 mr-3 text-gray-400" />
                      {user?.email || <span className="text-gray-300">No email added</span>}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={formData.city} 
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  ) : (
                    <div className="flex items-center text-lg font-medium">
                      <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                      {user?.city || 'Not specified'}
                    </div>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="font-bold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" /> Saved Addresses
                  </h3>
                  {user?.address_json ? (
                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                       <p className="text-sm">{typeof user.address_json === 'string' ? user.address_json : JSON.stringify(user.address_json)}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No addresses saved yet. They will appear here after your first booking.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
