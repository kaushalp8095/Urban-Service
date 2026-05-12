'use client';

import Link from 'next/link';
import { useCategories } from '@/lib/api/hooks';
import { useCity } from '@/components/providers/city-provider';

export function CategoriesGrid() {
  const { data: response, isLoading } = useCategories();
  const { citySlug } = useCity();

  // Fallback to static categories if backend isn't running or fails
  const categories = response?.data || [
    { name: 'AC Service & Repair', image_url: '❄️', id: 'ac-service' },
    { name: 'Home Cleaning',       image_url: '🧹', id: 'home-cleaning' },
    { name: 'Salon for Women',     image_url: '💅', id: 'salon-women' },
    { name: "Men's Salon",         image_url: '✂️', id: 'mens-haircut' },
    { name: 'Plumbing',            image_url: '🔧', id: 'plumbing' },
    { name: 'Electrician',         image_url: '⚡', id: 'electrician' },
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
        <Link href={`/${citySlug || 'mumbai'}/${c.id}`} key={c.id || idx}>
          <div className="flex flex-col items-center p-6 bg-white border rounded-xl hover-lift cursor-pointer h-full group">
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
