import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy | Urban Service',
  description: 'Refund and cancellation policy for Urban Service.',
};

export default function RefundPage() {
  return (
    <main style={{ minHeight: '70vh', padding: '80px 24px', maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Refund <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span></h1>
      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '40px' }}>Last updated: January 1, 2026</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {[
          { emoji: '✅', title: 'Full Refund', cond: 'Cancelled 2+ hours before service' },
          { emoji: '⚠️', title: '₹99 Fee', cond: 'Cancelled less than 2 hours before' },
          { emoji: '❌', title: 'No Refund', cond: 'No-show or service in progress' },
          { emoji: '🔄', title: 'Free Redo', cond: 'Quality complaint within 48 hours' },
        ].map(({ emoji, title, cond }) => (
          <div key={title} style={{ padding: '24px', borderRadius: '14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '6px' }}>{title}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{cond}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8', marginBottom: '32px' }}>
        Refunds are processed within 5–7 business days to the original payment method. For UPI payments, refunds may appear within 2–3 business days. Contact support@urbanservice.in for any refund queries.
      </p>
      <Link href="/" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>← Back to Home</Link>
    </main>
  );
}
