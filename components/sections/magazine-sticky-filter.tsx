'use client';

import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import type { Category } from '@/lib/wordpress';

interface MagazineStickyFilterProps {
  categories: Category[];
}

export const MagazineStickyFilter = ({ categories }: MagazineStickyFilterProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams();
    if (term) {
      params.set('search', term);
    } else {
      // If the term is empty, we don't want to redirect with an empty search
      return;
    }
    // Redirect to the main posts page to display search results
    replace(`/magazin?${params.toString()}`);
  };

  return (
    // The main header has a height of h-14. We make this sticky with top-14 to appear right below it.
    <div className="sticky top-14 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg hidden sm:block">Filter:</span>
            <nav className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0">
              <Link href="/magazin" className="text-gray-600 hover:text-primary font-medium flex-shrink-0">Alle</Link>
              {categories.map(category => (
                <Link 
                  href={`/magazin?category=${category.id}`}
                  key={category.id}
                  className="text-gray-600 hover:text-primary font-medium transition-colors flex-shrink-0"
                  dangerouslySetInnerHTML={{ __html: category.name }}
                />
              ))}
            </nav>
          </div>
          <div className="relative ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="search"
              placeholder="Suchen..."
              className="pl-10 pr-4 py-2 w-40 sm:w-56 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
