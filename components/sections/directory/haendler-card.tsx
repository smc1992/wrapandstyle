import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HaendlerProfileCard } from '@/lib/types';

export interface HaendlerCardProps {
  profile: HaendlerProfileCard;
}

export function HaendlerCard({ profile }: HaendlerCardProps) {
  const placeholderLogo = '/images/Logo-wrapandstyle.webp';

  return (
    <div className="bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="flex items-start mb-4">
        <Image
          src={profile.logo_url || placeholderLogo}
          alt={`${profile.firma || 'Händler'} Logo`}
          width={64}
          height={64}
          className="w-16 h-16 rounded-lg object-contain mr-4 flex-shrink-0 border border-gray-100 p-1"
        />
        <div className="flex-grow">
          <h3 className="font-bold text-lg leading-tight dark:text-white">{profile.firma || 'N/A'}</h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <i className="ri-map-pin-line mr-1.5 w-4 text-center"></i>
            <span>{profile.address || 'Keine Adresse angegeben'}</span>
          </div>
        </div>
      </div>

      {profile.brands && profile.brands.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
          {profile.brands.slice(0, 4).map((brand, index) => (
            <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs font-medium px-2.5 py-1 rounded-full">
              {brand}
            </span>
          ))}
        </div>
      )}

      <div className="flex-grow" /> 

      <Button asChild className="w-full mt-auto bg-primary hover:bg-primary/90 text-white !rounded-button font-medium whitespace-nowrap">
        <Link href={`/haendler/${profile.slug || ''}`}>Profil ansehen</Link>
      </Button>
    </div>
  );
}
