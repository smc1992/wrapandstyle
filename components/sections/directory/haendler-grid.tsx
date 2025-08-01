import React from 'react';
import { HaendlerCard } from './haendler-card';
import { Button } from '@/components/ui/button';
import { HaendlerProfileCard } from '@/lib/types';

interface HaendlerGridProps {
  profiles: HaendlerProfileCard[];
}

export function HaendlerGrid({ profiles }: HaendlerGridProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <HaendlerCard key={profile.user_id} profile={profile} />
          ))
        ) : (
          <p className="text-center md:col-span-2 text-gray-500 dark:text-gray-400">Aktuell sind keine Händler-Profile verfügbar.</p>
        )}
      </div>
      {profiles.length > 4 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 !rounded-button font-medium transition-colors whitespace-nowrap">
            Mehr Händler anzeigen
          </Button>
        </div>
      )}
    </div>
  );
}
