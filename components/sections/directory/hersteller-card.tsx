'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RiMapPinLine } from '@remixicon/react';
import { HerstellerProfileCard } from '@/lib/types';

interface HerstellerCardProps {
  profile: HerstellerProfileCard;
}

export function HerstellerCard({ profile }: HerstellerCardProps) {
  const logoSrc = profile.logo_url ?? '/images/Logo-wrapandstyle.webp';
  const firmaName = profile.firma ?? 'Unbekannter Hersteller';

  return (
    <Link href={`/hersteller/${profile.slug ?? '#'}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="relative h-40 w-full bg-gray-50 dark:bg-gray-700">
          <Image
            src={logoSrc}
            alt={`${firmaName} Logo`}
            fill
            className="object-contain p-4"
          />
        </div>
        <div className="p-4">
          <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white" title={firmaName}>
            {firmaName}
          </h3>
          <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <RiMapPinLine className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{profile.address ?? 'Keine Adresse angegeben'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
