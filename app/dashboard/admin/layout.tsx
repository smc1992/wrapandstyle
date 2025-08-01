import React from 'react';
import DashboardSidebar from '@/components/dashboard/dashboard-sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Optional: Add a check to ensure the user has the 'superadmin' role
  // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  // if (profile?.role !== 'superadmin') {
  //   return redirect('/dashboard'); // or show an unauthorized page
  // }

  // The parent layout (app/dashboard/layout.tsx) already provides the sidebar.
  // This layout only needs to pass its children through.
  return <>{children}</>;
}
