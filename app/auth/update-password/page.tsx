'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/lib/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // This event fires when the user lands on the page from the password recovery link.
        // The session is now available, so we can allow the password update.
        setIsSessionReady(true);
      } else if (session) {
        setIsSessionReady(true);
      }
    });

    // Check if there's already a session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsSessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      toast({
        title: 'Error',
        description: `Failed to update password: ${updateError.message}`,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Your password has been updated successfully. You will be redirected to the login page.',
      });
      // Redirect to login after a short delay to allow the user to read the toast.
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  if (!isSessionReady) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Update Password</CardTitle>
          <CardDescription>
            Enter your new password below. You will be redirected to the login page after a successful update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
