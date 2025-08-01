import { Suspense } from 'react';
import { Metadata } from 'next';
import { getHerstellerProfiles } from './actions';
import { HerstellerDirectorySection } from '@/components/sections/hersteller-directory-section';

export const metadata: Metadata = {
  title: 'Herstellerverzeichnis | WRAPS Magazin',
  description: 'Finden Sie die führenden Hersteller der Folierungsbranche. Suchen und filtern Sie nach Standort und Spezialisierung.',
};

export const dynamic = 'force-dynamic';

interface HerstellerPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HerstellerPage({ searchParams }: HerstellerPageProps) {
  const profiles = await getHerstellerProfiles(searchParams);

  return (
    <main className="py-8">
      <Suspense fallback={<DirectoryLoadingSkeleton />}>
        <HerstellerDirectorySection initialProfiles={profiles} />
      </Suspense>
    </main>
  );
}

function DirectoryLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div className="col-span-1">
          <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
