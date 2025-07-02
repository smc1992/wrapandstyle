import { createClient } from '@/lib/supabase/server';
import { TeamTable } from './team-table';
import { AddTeamMember } from '@/components/dashboard/add-team-member';
import { redirect } from 'next/navigation';

export default async function TeamManagementPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }



  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching team members:', error);
    return <p>Error loading team members. Please try again later.</p>;
  }

  // Format the date on the server to prevent hydration errors
  const formattedTeamMembers = teamMembers?.map(member => ({
    ...member,
    created_at: new Date(member.created_at).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
  }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Team Management</h1>
        <div className="ml-auto flex items-center gap-2">
          <AddTeamMember />
        </div>
      </div>
      <TeamTable teamMembers={formattedTeamMembers || []} />
    </main>
  );
}
