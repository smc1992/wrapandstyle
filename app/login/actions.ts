'use server'

import { createClient } from '@/lib/supabase/server';

export async function login(prevState: any, formData: FormData) {
  console.log('[Action] Login: Gestartet.');
  try {
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    console.log(`[Action] Login: Versuch für E-Mail=${email}, Rolle=${role}`);
        const supabase = await createClient();

  // Get the redirect URL from environment variables.
  // Make sure NEXT_PUBLIC_SITE_URL is set in your .env.local file (e.g., http://localhost:3000)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error('Server Configuration Error: NEXT_PUBLIC_SITE_URL is not set.');
    return {
      message: 'Ein Serverkonfigurationsfehler ist aufgetreten.',
      error: 'Missing site URL configuration',
      submitted: false,
    };
  }
  const emailRedirectTo = `${siteUrl}/auth/callback`;

  if (!email || !role) {
    return {
      message: 'E-Mail und Rolle sind erforderlich.',
      error: 'Missing email or role',
      submitted: false,
    };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: emailRedirectTo,
      data: {
        role: role,
      },
    },
  });

  if (error) {
    console.error('Supabase signInWithOtp Error:', error);

    const userMessage = error.message.includes('Database error')
      ? 'Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.'
      : `Fehler bei der Authentifizierung: ${error.message}`;

    return {
      message: userMessage,
      error: error.message,
      submitted: false,
    };
  }

    return {
      message: 'Erfolgreich! Bitte überprüfen Sie Ihre E-Mails für den Anmelde-Link.',
      error: null,
      submitted: true,
    };
  } catch (e: any) {
    console.error('[Action] Login: Kritischer, unerwarteter Fehler in der Server Action:', e);
    return {
      message: 'Ein unerwarteter Serverfehler ist aufgetreten. Die Entwickler wurden benachrichtigt.',
      error: e.message || 'Unhandled exception',
      submitted: false,
    };
  }
}
