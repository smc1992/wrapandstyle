'use client';

import { usePathname } from 'next/navigation';

export default function MainLayoutClient({
  children,
  header,
  footer
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  );
}
