import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Urban Service',
  description: 'Terms and conditions for using Urban Service platform.',
};

export default function TermsPage() {
  return (
    <main style={{ minHeight: '70vh', padding: '80px 24px', maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Terms & <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Conditions</span></h1>
      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '40px' }}>Last updated: January 1, 2026</p>
      {[
        { title: '1. Acceptance of Terms', content: 'By accessing or using Urban Service, you agree to be bound by these Terms. If you disagree, please do not use our platform.' },
        { title: '2. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use at support@urbanservice.in.' },
        { title: '3. Booking & Payments', content: 'All bookings are subject to availability. Payments must be completed at the time of booking or upon service completion as applicable.' },
        { title: '4. Cancellation Policy', content: 'Cancellations made 2+ hours before scheduled time are fully refunded. Late cancellations may incur a ₹99 cancellation fee.' },
        { title: '5. Service Guarantee', content: 'We guarantee quality service. If unsatisfied, report within 48 hours for a free redo or refund at our discretion.' },
        { title: '6. Limitation of Liability', content: 'Urban Service is not liable for indirect, incidental, or consequential damages arising from use of our platform beyond the amount paid for the specific service.' },
      ].map(({ title, content }) => (
        <div key={title} style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>{title}</h2>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.8' }}>{content}</p>
        </div>
      ))}
      <Link href="/" style={{ display: 'inline-flex', padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>← Back to Home</Link>
    </main>
  );
}
