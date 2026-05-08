'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight, CheckCircle, Star, Shield, Clock, Headphones } from 'lucide-react';

// Inline SVG social icons (lucide-react doesn't export brand icons)
const IconFacebook = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
const IconTwitter = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const IconInstagram = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>;
const IconLinkedin = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const IconYoutube = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>;

const SOCIAL_LINKS = [
  { Icon: IconFacebook, href: 'https://facebook.com', label: 'Facebook' },
  { Icon: IconTwitter, href: 'https://twitter.com', label: 'Twitter / X' },
  { Icon: IconInstagram, href: 'https://instagram.com', label: 'Instagram' },
  { Icon: IconLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { Icon: IconYoutube, href: 'https://youtube.com', label: 'YouTube' },
];

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Press & Media', href: '/press' },
  { label: 'Blog', href: '/blog' },
];

const CUSTOMER_LINKS = [
  { label: 'All Services', href: '/categories' },
  { label: 'My Bookings', href: '/orders' },
  { label: 'UC Reviews', href: '/reviews' },
  { label: 'Help Center', href: '/helpcenter' },
  { label: 'Track Service', href: '/orders' },
];

const PARTNER_LINKS = [
  { label: 'Become a Partner', href: '/partner' },
  { label: 'Partner Dashboard', href: '/partner/dashboard' },
  { label: 'Partner Support', href: '/helpcenter' },
  { label: 'Earnings Guide', href: '/partner' },
];

const TRUST_BADGES = [
  { icon: Star, label: '4.8★ Rating', sub: '50K+ Reviews' },
  { icon: Shield, label: '100% Verified', sub: 'Professionals' },
  { icon: Clock, label: '60-min', sub: 'Response Time' },
  { icon: Headphones, label: '24/7 Support', sub: 'Always Here' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800)); // simulate API
    setSubscribed(true);
    setLoading(false);
    setEmail('');
  };

  return (
    <>
      <style>{`
        .footer-root {
          background: linear-gradient(180deg, #0f0f1a 0%, #0a0a14 100%);
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
        }
        .footer-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(168,85,247,0.6), transparent);
        }
        .footer-glow-left {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-glow-right {
          position: absolute;
          bottom: 0;
          right: -80px;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .footer-trust-bar {
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 28px 0;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 24px;
        }
        .trust-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15));
          border: 1px solid rgba(99,102,241,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .footer-logo-gradient {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .footer-link {
          color: rgba(148,163,184,0.85);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          line-height: 1.6;
        }
        .footer-link:hover {
          color: #818cf8;
          padding-left: 6px;
        }
        .footer-link::before {
          content: '';
          width: 0;
          height: 1px;
          background: #818cf8;
          transition: width 0.2s ease;
          display: inline-block;
        }
        .footer-link:hover::before {
          width: 12px;
        }
        .footer-col-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .footer-col-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(99,102,241,0.4), transparent);
        }
        .newsletter-wrap {
          background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08));
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 18px;
          padding: 28px;
          margin-bottom: 48px;
        }
        .newsletter-input-row {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .newsletter-input {
          flex: 1;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }
        .newsletter-input::placeholder { color: rgba(148,163,184,0.5); }
        .newsletter-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(255,255,255,0.09);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .newsletter-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 12px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(99,102,241,0.35);
        }
        .newsletter-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(99,102,241,0.5);
        }
        .newsletter-btn:disabled { opacity: 0.7; cursor: default; }
        .social-btn {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(148,163,184,0.8);
          transition: all 0.22s ease;
          text-decoration: none;
        }
        .social-btn:hover {
          transform: translateY(-3px);
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.35);
          color: #818cf8;
          box-shadow: 0 8px 20px rgba(99,102,241,0.2);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 24px 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .footer-bottom-link {
          color: rgba(148,163,184,0.65);
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }
        .footer-bottom-link:hover { color: #818cf8; }
        .app-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 500;
        }
        .app-badge:hover {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.3);
        }
        /* ── Mobile Responsive ── */
        @media (max-width: 640px) {
          .footer-trust-bar { padding: 20px 0; }
          .trust-item { padding: 0 8px; }
          .newsletter-wrap { padding: 20px 16px; border-radius: 14px; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
          .footer-bottom > div { flex-wrap: wrap; gap: 12px; }
          .newsletter-form-mobile { flex-direction: column !important; }
          .newsletter-form-mobile button { width: 100% !important; justify-content: center; }
          .footer-main-padding { padding: 36px 16px 24px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
          .footer-brand-col { grid-column: 1 / -1 !important; }
          .trust-grid-mobile { grid-template-columns: 1fr 1fr !important; gap: 12px !important; }
        }
        @media (max-width: 400px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .trust-grid-mobile { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-glow-left" />
        <div className="footer-glow-right" />

        {/* Trust Bar */}
        <div className="footer-trust-bar">
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
            <div className="trust-grid-mobile" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
                <div className="trust-item" key={label}>
                  <div className="trust-icon-wrap">
                    <Icon size={20} color="#818cf8" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(148,163,184,0.7)', marginTop: '2px' }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="footer-main-padding" style={{ maxWidth: '1280px', margin: '0 auto', padding: '56px 24px 32px' }}>

          {/* Newsletter */}
          <div className="newsletter-wrap">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ maxWidth: '420px' }}>
                <div style={{ fontWeight: 700, fontSize: '18px', color: 'white', marginBottom: '6px' }}>
                  🎯 Get exclusive service offers
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(148,163,184,0.75)' }}>
                  Subscribe for deals, home tips, and seasonal discounts straight to your inbox.
                </div>
              </div>
              {subscribed ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#4ade80', fontWeight: 600 }}>
                  <CheckCircle size={22} />
                  You&apos;re subscribed! Welcome aboard 🎉
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="newsletter-form-mobile" style={{ display: 'flex', gap: '10px', flex: '1', minWidth: '0', maxWidth: '480px', width: '100%' }}>
                  <input
                    className="newsletter-input"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <button className="newsletter-btn" type="submit" disabled={loading}>
                    {loading ? (
                      <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    ) : (
                      <><ArrowRight size={16} /> Subscribe</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '48px' }}>

            {/* Brand Column */}
            <div className="footer-brand-col" style={{ gridColumn: 'span 1' }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Urban</span>
                <span className="footer-logo-gradient" style={{ fontSize: '24px', fontWeight: 800 }}>Service</span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(148,163,184,0.75)', lineHeight: '1.75', marginBottom: '20px' }}>
                Quality home services, on demand. Book verified professionals for all your home needs — fast, safe, and guaranteed.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <a href="tel:+911800000000" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(148,163,184,0.75)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.75)')}>
                  <Phone size={14} /> 1800-000-0000 (Toll Free)
                </a>
                <a href="mailto:support@urbanservice.in" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(148,163,184,0.75)', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(148,163,184,0.75)')}>
                  <Mail size={14} /> support@urbanservice.in
                </a>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'rgba(148,163,184,0.75)', fontSize: '13px' }}>
                  <MapPin size={14} style={{ marginTop: '2px', flexShrink: 0 }} /> 123 Urban Tower, Bandra West, Mumbai – 400050
                </div>
              </div>
              {/* Socials */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="social-btn" aria-label={label}>
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <div className="footer-col-title">Company</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="footer-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Customers */}
            <div>
              <div className="footer-col-title">For Customers</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {CUSTOMER_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="footer-link">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Partners */}
            <div>
              <div className="footer-col-title">For Partners</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PARTNER_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="footer-link">{label}</Link>
                  </li>
                ))}
              </ul>

              {/* App Download */}
              <div style={{ marginTop: '24px' }}>
                <div className="footer-col-title">Download App</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a href="#" className="app-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    App Store
                  </a>
                  <a href="#" className="app-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.3.17.65.19.96.07L13.84 12 3.06.17C2.75.05 2.4.07 2.1.24 1.5.6 1.5 1.3 1.5 1.3V22.7s0 .7.68 1.06M19.5 10.2l-2.63-1.52-3.18 3.32 3.18 3.32 2.66-1.54c.76-.44.76-1.14.76-1.14s0-.7-.79-1.44M4.38 1.08L14.25 11l-2.97 3.06-6.9-13z"/></svg>
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div style={{ fontSize: '13px', color: 'rgba(148,163,184,0.55)' }}>
              © {new Date().getFullYear()} Urban Service Technologies Pvt. Ltd. · Made with ❤️ in India
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
              <Link href="/privacy" className="footer-bottom-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-bottom-link">Terms & Conditions</Link>
              <Link href="/refund" className="footer-bottom-link">Refund Policy</Link>
              <Link href="/sitemap" className="footer-bottom-link">Sitemap</Link>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </footer>
    </>
  );
}
