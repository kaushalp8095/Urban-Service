'use client';

import Link from 'next/link';
import { User, Briefcase, LogOut, Menu, X, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitySelect } from '@/components/ui/city-select';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUserPhone(localStorage.getItem('userPhone') || '');
    setUserName(localStorage.getItem('userName') || '');
    setMobileMenuOpen(false); // close on route change
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserPhone('');
    setUserName('');
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Logo & City */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl md:text-2xl font-bold text-black tracking-tight shrink-0">
              Urban<span className="text-primary">Service</span>
            </Link>
            <CitySelect />
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/partner/dashboard">
              <Button variant="ghost" className="text-sm font-medium">
                <Briefcase className="w-4 h-4 mr-2" />
                Partner Panel
              </Button>
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/profile">
                  <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md hover:bg-slate-200 cursor-pointer transition-colors">
                    {userName ? `Hi, ${userName.split(' ')[0]}` : `+91 ${userPhone}`}
                  </span>
                </Link>
                <Button variant="outline" className="text-sm font-medium" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="text-sm font-medium">
                  <User className="w-4 h-4 mr-2" />
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                      {userName ? userName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{userName || 'User'}</div>
                      <div className="text-xs text-muted-foreground">+91 {userPhone}</div>
                    </div>
                  </div>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <Home className="w-4 h-4 text-gray-500" /> Home
                  </Link>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <User className="w-4 h-4 text-gray-500" /> My Profile
                  </Link>
                  <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <ShoppingBag className="w-4 h-4 text-gray-500" /> My Bookings
                  </Link>
                  <Link href="/partner/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <Briefcase className="w-4 h-4 text-gray-500" /> Partner Panel
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-sm font-medium text-red-500 mt-1">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <Home className="w-4 h-4 text-gray-500" /> Home
                  </Link>
                  <Link href="/partner/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-sm font-medium">
                    <Briefcase className="w-4 h-4 text-gray-500" /> Partner Panel
                  </Link>
                  <div className="pt-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Login / Sign Up
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
