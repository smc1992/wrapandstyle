import { createClient } from '@/lib/supabase/server';
import { UsersTable, type UserForTable } from '@/components/admin/users-table';
import { type Profile } from '@/lib/types';

interface UserListProps {
  searchQuery: string;
  roleFilter: string;
}

export async function UserList({ searchQuery, roleFilter }: UserListProps) {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      id, created_at, email, role, full_name, avatar_url,
      folierer(firma),
      hersteller(firma),
      haendler(firma)
    `);

  if (error) {
    console.error('Error loading users:', error);
    return <div className="p-4 text-red-500">Fehler beim Laden der Benutzer: {error.message}</div>;
  }

  // Manually construct the users array with the correct company_name
  let users: UserForTable[] = (profiles || []).map((p: any) => {
    let company_name = '';
    if (p.role === 'folierer' && p.folierer?.[0]?.firma) {
      company_name = p.folierer[0].firma;
    } else if (p.role === 'hersteller' && p.hersteller?.[0]?.firma) {
      company_name = p.hersteller[0].firma;
    } else if (p.role === 'haendler' && p.haendler?.[0]?.firma) {
      company_name = p.haendler[0].firma;
    }

    return {
      // Explicitly map only the fields needed for the table from the Profile type
      id: p.id,
      created_at: p.created_at,
      email: p.email,
      role: p.role,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      // Add the constructed company name
      company_name: company_name || p.full_name || 'N/A',
      // Pass along the raw role data for the actions menu if needed
      folierer: p.folierer,
      hersteller: p.hersteller,
      haendler: p.haendler,
    };
  });

  if (searchQuery) {
    const lowercasedQuery = searchQuery.toLowerCase();
    users = users.filter(user => 
      user.email?.toLowerCase().includes(lowercasedQuery) ||
      user.full_name?.toLowerCase().includes(lowercasedQuery) ||
      user.company_name?.toLowerCase().includes(lowercasedQuery)
    );
  }

  if (roleFilter) {
    users = users.filter(user => user.role === roleFilter);
  }

  // Sort the filtered users
  users.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return <UsersTable users={users} />;
}
