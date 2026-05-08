'use client';

import Link from 'next/link';
import { User, Briefcase, LogOut, Menu, X, Home, ShoppingBag, ChevronDown, Settings } from 'lucide-react';
import { CitySelect } from '@/components/ui/city-select';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUserPhone(localStorage.getItem('userPhone') || '');
    setUserName(localStorage.getItem('userName') || '');
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserPhone('');
    setUserName('');
    setMobileMenuOpen(false);
    setProfileOpen(false);
    router.push('/');
  };

  const initials = userName ? userName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() : 'U';

  return (
    <>
      <style>{`
        .header-glass {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.4);
          box-shadow: 0 1px 40px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }
        .header-glass.scrolled {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 32px rgba(0,0,0,0.12);
        }
        .logo-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border-radius: 50%;
          display: inline-block;
          margin-left: 2px;
          vertical-align: super;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        .btn-primary-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 9px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(99,102,241,0.35);
          text-decoration: none;
        }
        .btn-primary-gradient:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(99,102,241,0.5);
        }
        .btn-ghost-nav {
          background: transparent;
          border: 1.5px solid transparent;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #374151;
          text-decoration: none;
        }
        .btn-ghost-nav:hover {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.2);
          color: #6366f1;
        }
        .avatar-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 2px solid rgba(99,102,241,0.3);
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(99,102,241,0.3);
        }
        .avatar-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 18px rgba(99,102,241,0.45);
        }
        .profile-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          min-width: 220px;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(99,102,241,0.1);
          overflow: hidden;
          animation: dropdown-in 0.18s ease;
          z-index: 100;
        }
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dropdown-header {
          padding: 16px;
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06));
          border-bottom: 1px solid rgba(99,102,241,0.08);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: all 0.15s ease;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }
        .dropdown-item:hover {
          background: rgba(99,102,241,0.06);
          color: #6366f1;
        }
        .dropdown-item.danger:hover {
          background: rgba(239,68,68,0.06);
          color: #ef4444;
        }
        .dropdown-divider {
          height: 1px;
          background: rgba(0,0,0,0.06);
          margin: 4px 0;
        }
        .hamburger-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1.5px solid rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hamburger-btn:hover {
          background: rgba(99,102,241,0.08);
          border-color: rgba(99,102,241,0.3);
        }
        .mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(4px);
          z-index: 40;
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: min(340px, 88vw);
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(24px);
          z-index: 50;
          box-shadow: -10px 0 60px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          animation: slide-in 0.28s cubic-bezier(0.34,1.1,0.64,1);
          overflow-y: auto;
        }
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .drawer-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .drawer-user-card {
          margin: 16px;
          padding: 16px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.07));
          border: 1px solid rgba(99,102,241,0.15);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .drawer-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          font-size: 15px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          transition: all 0.15s ease;
          border-radius: 0;
          cursor: pointer;
          background: transparent;
          border: none;
          width: 100%;
          text-align: left;
        }
        .drawer-nav-item:hover {
          background: rgba(99,102,241,0.06);
          color: #6366f1;
          padding-left: 26px;
        }
        .drawer-nav-item.danger:hover {
          background: rgba(239,68,68,0.06);
          color: #ef4444;
          padding-left: 26px;
        }
        .drawer-nav-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(99,102,241,0.1);
          color: #6366f1;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .partner-chip {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.12));
          color: #6366f1;
          border: 1px solid rgba(99,102,241,0.2);
          margin-left: auto;
        }
        /* ── Mobile Header Responsive ── */
        @media (max-width: 768px) {
          .header-inner {
            padding: 0 16px !important;
            height: 58px !important;
          }
          .header-logo-text {
            font-size: 19px !important;
          }
        }
        @media (max-width: 400px) {
          .header-inner {
            padding: 0 12px !important;
          }
          .header-logo-text {
            font-size: 17px !important;
          }
        }
      `}</style>

      <header className={`header-glass sticky top-0 z-50 ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '66px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>

          {/* Left: Logo & City */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
              <span className="header-logo-text" style={{ fontSize: '22px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
                Urban
              </span>
              <span className="header-logo-text logo-gradient" style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Service
              </span>
              <span className="logo-dot" />
            </Link>
            <div className="hidden md:block">
              <CitySelect />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '6px' }}>
            <Link href="/partner" className="btn-ghost-nav">
              <Briefcase size={16} />
              Partner Panel
              <span className="partner-chip">PRO</span>
            </Link>

            {isLoggedIn ? (
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  className="avatar-btn"
                  onClick={() => setProfileOpen(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'auto', padding: '6px 12px 6px 8px', borderRadius: '50px', border: '2px solid rgba(99,102,241,0.25)' }}
                >
                  <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>{initials}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName ? userName.split(' ')[0] : `+91 ${userPhone}`}</span>
                  <ChevronDown size={14} style={{ color: '#6b7280', transition: 'transform 0.2s', transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>{userName || 'User'}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>+91 {userPhone}</div>
                    </div>
                    <Link href="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <User size={16} /> My Profile
                    </Link>
                    <Link href="/orders" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <ShoppingBag size={16} /> My Bookings
                    </Link>
                    <Link href="/partner" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Briefcase size={16} /> Partner Panel
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary-gradient" style={{ marginLeft: '6px' }}>
                <User size={16} />
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden hamburger-btn"
            onClick={() => setMobileMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div className="mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer">
            {/* Drawer Header */}
            <div className="drawer-header">
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>
                Urban<span className="logo-gradient">Service</span>
              </span>
              <button className="hamburger-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* City selector in mobile */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <CitySelect />
            </div>

            {/* User card */}
            {isLoggedIn ? (
              <>
                <div className="drawer-user-card">
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', color: 'white', flexShrink: 0 }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#111827' }}>{userName || 'User'}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>+91 {userPhone}</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <Link href="/" className="drawer-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <div className="drawer-nav-icon"><Home size={16} /></div>
                    Home
                  </Link>
                  <Link href="/profile" className="drawer-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <div className="drawer-nav-icon"><User size={16} /></div>
                    My Profile
                  </Link>
                  <Link href="/orders" className="drawer-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <div className="drawer-nav-icon"><ShoppingBag size={16} /></div>
                    My Bookings
                  </Link>
                  <Link href="/partner" className="drawer-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <div className="drawer-nav-icon"><Briefcase size={16} /></div>
                    Partner Panel
                    <span className="partner-chip">PRO</span>
                  </Link>
                  <Link href="/admin/dashboard" className="drawer-nav-item" onClick={() => setMobileMenuOpen(false)}>
                    <div className="drawer-nav-icon"><Settings size={16} /></div>
                    Admin Dashboard
                  </Link>
                  <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '8px 0' }} />
                  <button className="drawer-nav-item danger" onClick={handleLogout}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', color: '#ef4444', flexShrink: 0 }}>
                      <LogOut size={16} />
                    </div>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1 }}>
                <Link href="/" className="drawer-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <div className="drawer-nav-icon"><Home size={16} /></div>
                  Home
                </Link>
                <Link href="/partner" className="drawer-nav-item" onClick={() => setMobileMenuOpen(false)}>
                  <div className="drawer-nav-icon"><Briefcase size={16} /></div>
                  Partner Panel
                  <span className="partner-chip">PRO</span>
                </Link>
                <div style={{ padding: '16px', marginTop: 'auto' }}>
                  <Link href="/login" className="btn-primary-gradient" onClick={() => setMobileMenuOpen(false)} style={{ justifyContent: 'center', width: '100%' }}>
                    <User size={16} />
                    Login / Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
