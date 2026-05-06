'use client';

import Link from 'next/link';
import { useCategories } from '@/lib/api/hooks';
import { usePathname } from 'next/navigation';

export function CategoriesGrid() {
  const { data: response, isLoading } = useCategories();
  const pathname = usePathname();
  
  // Extract city from URL path if present (e.g., /ahmedabad)
  const pathSegments = pathname.split('/').filter(Boolean);
  const city = pathSegments.length > 0 && !['login', 'booking', 'orders', 'profile', 'partner', 'admin'].includes(pathSegments[0])
    ? pathSegments[0]
    : 'mumbai';

  // Fallback to static if backend isn't running or fails
  const categories = response?.data || [
    { name: 'AC Service & Repair', image_url: '❄️', id: 'ac-service', desc: 'Gas refill, cleaning & repair' },
    { name: 'Home Cleaning', image_url: '🧹', id: 'home-cleaning', desc: 'Deep clean, bathroom & kitchen' },
    { name: 'Salon for Women', image_url: '💅', id: 'salon-women', desc: 'Waxing, facials & hair' },
    { name: "Men's Salon", image_url: '✂️', id: 'mens-haircut', desc: 'Haircut, shave & beard' },
    { name: 'Plumbing', image_url: '🔧', id: 'plumbing', desc: 'Leakage, fixture & pipes' },
    { name: 'Electrician', image_url: '⚡', id: 'electrician', desc: 'Wiring, fans & switches' },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
      {categories.map((c: any, idx: number) => (
        <Link href={`/${city}/${c.id}`} key={c.id || idx}>
          <div className="flex flex-col items-center p-6 bg-white border rounded-xl hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer h-full group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
              {c.image_url || '✨'}
            </div>
            <h3 className="text-sm font-semibold text-center">{c.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
