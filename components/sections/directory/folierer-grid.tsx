import React from 'react';
import { FoliererCard } from './folierer-card';
import { Button } from '@/components/ui/button';
import { FoliererProfileCard } from '@/lib/types';

interface FoliererGridProps {
  profiles: FoliererProfileCard[];
}

export function FoliererGrid({ profiles }: FoliererGridProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profiles.length > 0 ? (
          profiles.map((profile) => (
            <FoliererCard key={profile.user_id} profile={profile} />
          ))
        ) : (
          <p className="text-center md:col-span-2 text-gray-500 dark:text-gray-400">Aktuell sind keine Folierer-Profile verfügbar.</p>
        )}
      </div>
      {profiles.length > 4 && (
        <div className="mt-8 text-center">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 !rounded-button font-medium transition-colors whitespace-nowrap">
            Mehr Folierer anzeigen
          </Button>
        </div>
      )}
    </div>
  );
}

