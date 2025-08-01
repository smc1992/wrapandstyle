"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function UserFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleRoleChange = (role: string) => {
    const params = new URLSearchParams(searchParams);
    if (role && role !== 'all') {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Search by email..."
          className="w-full rounded-lg bg-background"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('q')?.toString()}
        />
      </div>
      <Select
        onValueChange={handleRoleChange}
        defaultValue={searchParams.get('role')?.toString() || 'all'}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="superadmin">Super-Admin</SelectItem>
          <SelectItem value="hersteller">Hersteller</SelectItem>
          <SelectItem value="folierer">Folierer</SelectItem>
          <SelectItem value="haendler">Händler</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
