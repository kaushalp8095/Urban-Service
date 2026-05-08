import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help Center | Urban Service',
  description: 'Find answers to your questions about Urban Service.',
};

const FAQS = [
  { q: 'How do I book a service?', a: 'Browse services, select your city, choose a slot, and confirm. You\'ll receive instant confirmation via SMS & email.' },
  { q: 'Are the professionals verified?', a: 'Yes! Every professional undergoes background verification, skill testing, and ID checks before joining our platform.' },
  { q: 'Can I reschedule or cancel a booking?', a: 'Yes. You can reschedule or cancel for free up to 2 hours before the scheduled time from My Bookings.' },
  { q: 'What if I\'m not satisfied with the service?', a: 'We offer a 100% satisfaction guarantee. Raise a complaint within 48 hours and we\'ll resolve or re-do the service.' },
  { q: 'How do I become a partner?', a: 'Click "Become a Partner" in the footer or visit /partner to register and start earning.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, Credit/Debit Cards, Net Banking, and Cash on completion.' },
];

export default function HelpCenterPage() {
  return (
    <main style={{ minHeight: '70vh', padding: '80px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '12px' }}>Help <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Center</span></h1>
      <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '48px' }}>Frequently asked questions about Urban Service.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
        {FAQS.map(({ q, a }) => (
          <div key={q} style={{ padding: '24px', borderRadius: '14px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '8px' }}>❓ {q}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7' }}>{a}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '24px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.07))', border: '1px solid rgba(99,102,241,0.2)', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Still need help?</div>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>Our support team is available Mon–Sat, 9am – 8pm</p>
        <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
          Contact Support →
        </Link>
      </div>
    </main>
  );
}
