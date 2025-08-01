import { HaendlerDirectorySection } from '@/components/sections/haendler-directory-section';
import { Suspense } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Händler Verzeichnis | WRAPS Magazin',
  description: 'Finden Sie Händler und Distributoren für Fahrzeugfolien und Zubehör in Ihrer Nähe.',
};

export default function HaendlerPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  return (
    <main>
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Lade Verzeichnis...</div>}>
        <HaendlerDirectorySection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

