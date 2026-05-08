import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Urban Service',
  description: 'Learn about Urban Service – India\'s trusted home services platform.',
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: '70vh', padding: '80px 24px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px' }}>About <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Urban Service</span></h1>
      <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.8', marginBottom: '32px' }}>
        Urban Service is India&apos;s most trusted on-demand home services marketplace, connecting millions of customers with verified professionals across 50+ cities.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        {[
          { stat: '5M+', label: 'Customers Served' },
          { stat: '50K+', label: 'Verified Partners' },
          { stat: '50+', label: 'Cities' },
          { stat: '4.8★', label: 'Average Rating' },
        ].map(({ stat, label }) => (
          <div key={label} style={{ padding: '28px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(168,85,247,0.06))', border: '1px solid rgba(99,102,241,0.15)', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '6px' }}>{label}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Our Mission</h2>
      <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.8', marginBottom: '24px' }}>
        To make quality home services accessible, affordable, and reliable for every Indian household — while empowering skilled professionals to build sustainable livelihoods.
      </p>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
        Explore Services →
      </Link>
    </main>
  );
}
