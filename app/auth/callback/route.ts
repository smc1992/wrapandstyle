import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('[AUTH CALLBACK] Handler invoked.');
  try {
  console.log('[AUTH CALLBACK] Processing request URL...');
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  console.log('\n--- [AUTH CALLBACK] ---');
  console.log(`Request URL: ${request.url}`);
  console.log(`Code found: ${!!code}`);

  console.log(`[AUTH CALLBACK] Code: ${code}, Next: ${next}`);
  if (code) {
    console.log('[AUTH CALLBACK] Code found. Attempting to get cookie store...');
    console.log('[AUTH CALLBACK] Creating Supabase server client using shared helper...');
    const supabase = await createClient();

    console.log('[AUTH CALLBACK] Supabase client created. Exchanging code for session...');
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[AUTH CALLBACK] Error exchanging code for session:', error.message);
      // Bei Fehler zur Fehlerseite weiterleiten
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-error?message=${encodeURIComponent(error.message)}`);
    }

    console.log('[AUTH CALLBACK] Session successfully exchanged. Redirecting to dashboard.');
    // Erfolgreich ausgetauscht, weiterleiten zur 'next'-URL (z.B. /dashboard)
    return NextResponse.redirect(`${requestUrl.origin}${next}`);
  } else {
    console.log('[AUTH CALLBACK] No authorization code found.');
    // Kein Code gefunden, zur Fehlerseite weiterleiten
    return NextResponse.redirect(`${requestUrl.origin}/auth/auth-error?message=No authorization code found`);
  }
} catch (e: any) {
  console.error('[AUTH CALLBACK] CRITICAL ERROR in handler:', e);
  return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
}
} // Closing brace for the GET function

