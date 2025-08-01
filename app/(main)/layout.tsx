// app/(main)/layout.tsx
import MainLayoutClient from '../main-layout-client';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import '@/app/globals.css';

export default function MainLayout({ 
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayoutClient header={<Header />} footer={<Footer />}>
      {children}
      <Toaster />
    </MainLayoutClient>
  );
}
