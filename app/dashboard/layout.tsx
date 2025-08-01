import DashboardSidebar from '@/components/dashboard/dashboard-sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// This layout now only checks for an authenticated user and renders the shell.
// Data fetching is delegated back to the client components to prevent blocking the entire dashboard.

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="flex h-screen bg-background">
      {/* The sidebar now fetches its own data */}
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
