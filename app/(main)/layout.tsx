// app/(main)/layout.tsx
import MainLayoutClient from '../main-layout-client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import '@/app/globals.css';

import { createClient } from '@/lib/supabase/server';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <MainLayoutClient header={<Header user={user} />} footer={<Footer />}>
      {children}
      <Toaster />
    </MainLayoutClient>
  );
}
