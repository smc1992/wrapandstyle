'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import LogoutButton from './logout-button';
import type { User } from '@supabase/supabase-js';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function HeaderAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    // Render a placeholder to prevent layout shift and match button height
    return <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />;
  }

  return user ? (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
      <Link href="/dashboard">
        <Button variant="outline">Dashboard</Button>
      </Link>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
}
