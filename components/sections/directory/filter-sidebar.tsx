'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/use-debounce';
import { Brand, ProductCategory } from '@/lib/wordpress';

interface FilterSidebarProps {
  brands?: Brand[];
  productCategories?: ProductCategory[];
}

export function FilterSidebar({ brands, productCategories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Helper to get initial state from URL search params
  const getInitialState = (param: string | null): string[] => {
    if (typeof param === 'string' && param.length > 0) return param.split(',');
    return [];
  };

  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(getInitialState(searchParams.get('categories')));
  const [selectedBrands, setSelectedBrands] = useState<string[]>(getInitialState(searchParams.get('brands')));

  const debouncedLocation = useDebounce(location, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (debouncedLocation) {
      params.set('location', debouncedLocation);
    } else {
      params.delete('location');
    }

    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    } else {
      params.delete('categories');
    }

    if (selectedBrands.length > 0) {
      params.set('brands', selectedBrands.join(','));
    } else {
      params.delete('brands');
    }

    // Using requestAnimationFrame to prevent race conditions with Next.js router
    requestAnimationFrame(() => {
      router.push(`${pathname}?${params.toString()}`);
    });

  }, [debouncedLocation, selectedCategories, selectedBrands, pathname, router]);

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter(slug => slug !== categorySlug);
    setSelectedCategories(newCategories);
  };

  const handleBrandChange = (brandSlug: string, checked: boolean) => {
    const newBrands = checked
      ? [...selectedBrands, brandSlug]
      : selectedBrands.filter(slug => slug !== brandSlug);
    setSelectedBrands(newBrands);
  };

  return (
    <div className="bg-white dark:bg-background p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 lg:sticky top-24">
      <h3 className="text-xl font-bold dark:text-white">Suche filtern</h3>
      
      <div className="mb-6">
        <Label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ort oder PLZ</Label>
        <Input 
          type="text" 
          id="location" 
          placeholder="z.B. Berlin oder 10115"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Product Category Filter - Conditionally render if productCategories are provided */}
      {productCategories && productCategories.length > 0 && (
        <div className="mb-8">
          <h4 className="font-medium mb-3 text-gray-800 dark:text-white">Produktkategorien</h4>
          <div className="space-y-3">
            {productCategories.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cat-${item.id}`}
                  checked={selectedCategories.includes(item.slug)}
                  onCheckedChange={(checked) => handleCategoryChange(item.slug, !!checked)}
                />
                <Label htmlFor={`cat-${item.id}`} className="text-sm font-normal">{item.name}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Brand Filter - Conditionally render if brands are provided */}
      {brands && brands.length > 0 && (
        <div className="mb-8">
          <h4 className="font-medium mb-3 text-gray-800">Marken</h4>
          <div className="space-y-3">
            {brands.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`brand-${item.id}`}
                  checked={selectedBrands.includes(item.slug)}
                  onCheckedChange={(checked) => handleBrandChange(item.slug, !!checked)}
                />
                <Label htmlFor={`brand-${item.id}`} className="text-sm font-normal">{item.name}</Label>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
