import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserFilters } from '@/components/admin/user-filters';
import { UserList } from './user-list'; // Import the new component

export const dynamic = 'force-dynamic';

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string };
}) {
  const searchQuery = searchParams?.q || '';
  const roleFilter = searchParams?.role || '';

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-muted/40">
        <h1 className="text-xl font-semibold">Benutzerverwaltung</h1>
        <Button asChild>
          <Link href="/dashboard/admin/users/new">Benutzer erstellen</Link>
        </Button>
      </header>
      <main className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 py-4">
          <UserFilters />
        </div>
        <Suspense fallback={<div className="text-center p-8">Benutzer werden geladen...</div>}>
          <UserList searchQuery={searchQuery} roleFilter={roleFilter} />
        </Suspense>
      </main>
    </div>
  );
}
