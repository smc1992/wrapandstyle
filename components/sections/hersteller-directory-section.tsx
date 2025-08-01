'use client';

import { useState, useTransition, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { HerstellerProfileCard } from '@/lib/types';
import { HerstellerCard } from '@/components/sections/directory/hersteller-card';
import { HerstellerFilterSidebar } from '@/components/sections/directory/hersteller-filter-sidebar';

interface HerstellerDirectorySectionProps {
  initialProfiles: HerstellerProfileCard[];
}

export function HerstellerDirectorySection({ initialProfiles }: HerstellerDirectorySectionProps) {
  const [profiles, setProfiles] = useState<HerstellerProfileCard[]>(initialProfiles);
  const [isPending, startTransition] = useTransition();
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);

  const handleFilterChange = useDebouncedCallback((formData: FormData) => {
    const params = new URLSearchParams(window.location.search);
    const location = formData.get('location') as string;
    
    if (location) {
      params.set('location', location);
    } else {
      params.delete('location');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="col-span-1">
          <HerstellerFilterSidebar 
            onFilterChange={handleFilterChange} 
            isPending={isPending} 
          />
        </div>
        <div className="col-span-1 lg:col-span-3">
          {isPending ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              ))}
            </div>
          ) : profiles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {profiles.map(profile => (
                <HerstellerCard key={profile.user_id} profile={profile} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-center dark:border-gray-600 dark:bg-gray-800">
              <div className="text-gray-500 dark:text-gray-400">
                <h3 className="text-lg font-medium">Keine Hersteller gefunden</h3>
                <p className="mt-1 text-sm">Versuchen Sie, Ihre Suche anzupassen oder den Filter zurückzusetzen.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
