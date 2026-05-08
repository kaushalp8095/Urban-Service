import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Urban Service',
  description: 'Privacy Policy for Urban Service platform.',
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '70vh', padding: '80px 24px', maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>Privacy <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span></h1>
      <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '40px' }}>Last updated: January 1, 2026</p>
      {[
        { title: '1. Information We Collect', content: 'We collect your name, phone number, email address, and location to provide our services. We may also collect device information and usage data to improve the platform.' },
        { title: '2. How We Use Your Information', content: 'Your information is used to process bookings, communicate service updates, send promotional offers (with consent), and improve our platform experience.' },
        { title: '3. Data Sharing', content: 'We share your information only with service professionals assigned to your booking. We do not sell your personal data to third parties.' },
        { title: '4. Data Security', content: 'We use industry-standard encryption and security measures to protect your data. All payment transactions are processed through PCI-DSS compliant gateways.' },
        { title: '5. Your Rights', content: 'You have the right to access, correct, or delete your personal data. Contact us at privacy@urbanservice.in to exercise your rights.' },
        { title: '6. Contact', content: 'For privacy-related queries, email us at privacy@urbanservice.in or call 1800-000-0000.' },
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
