'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <main style={{ minHeight: '70vh', padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '12px' }}>Contact <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Us</span></h1>
      <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '48px' }}>We&apos;re here to help! Reach out via any channel below.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        {[
          { emoji: '📞', title: 'Phone Support', detail: '1800-000-0000', sub: 'Mon–Sat, 9am – 8pm', href: 'tel:+911800000000' },
          { emoji: '✉️', title: 'Email Support', detail: 'support@urbanservice.in', sub: 'Reply within 24 hours', href: 'mailto:support@urbanservice.in' },
          { emoji: '💬', title: 'Live Chat', detail: 'Chat with us now', sub: 'Available 24/7', href: '#' },
        ].map(({ emoji, title, detail, sub, href }) => (
          <a key={title} href={href} style={{ padding: '28px', borderRadius: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)')}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>{emoji}</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '14px', color: '#6366f1', fontWeight: 600, marginBottom: '4px' }}>{detail}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{sub}</div>
          </a>
        ))}
      </div>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
        ← Back to Home
      </Link>
    </main>
  );
}
