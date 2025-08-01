'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RiLoader4Line, RiSearchLine } from '@remixicon/react';

interface HerstellerFilterSidebarProps {
  onFilterChange: (formData: FormData) => void;
  isPending: boolean;
}

export function HerstellerFilterSidebar({ onFilterChange, isPending }: HerstellerFilterSidebarProps) {
  const searchParams = useSearchParams();
  const location = searchParams.get('location') || '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onFilterChange(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter</h3>
      <div className="mt-4 space-y-4">
        <div>
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Standort (PLZ oder Stadt)
          </Label>
          <div className="relative mt-1">
            <Input
              type="text"
              id="location"
              name="location"
              defaultValue={location}
              placeholder="z.B. Berlin"
              className="pl-10"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <RiSearchLine className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RiSearchLine className="mr-2 h-4 w-4" />
          )}
          Filter anwenden
        </Button>
      </div>
    </form>
  );
}
