import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch the user's role from the 'profiles' table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Dashboard Layout: Error fetching user profile or profile not found.', profileError);
    // Redirect to a generic error page or login with an error message
    return redirect('/login?error=profile_not_found');
  }

  const userRole = profile.role;

  if (!userRole) {
    console.error('Dashboard Layout: User has no role assigned in their profile.');
    return redirect('/login?error=no_role_assigned');
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Pass the correct user object and role to the sidebar */}
      <DashboardSidebar user={user} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
