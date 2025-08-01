import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError.message);
          return NextResponse.redirect(`${origin}/login?message=Could not retrieve user profile.`);
        }

        if (profile && profile.role) {
          let redirectPath = '/'; // Default redirect
          switch (profile.role) {
            case 'superadmin':
              redirectPath = '/dashboard/admin';
              break;
            case 'hersteller':
            case 'folierer':
            case 'haendler':
              redirectPath = `/dashboard/${profile.role}`;
              break;
            default:
              // Optional: handle unknown roles
              redirectPath = '/login?message=Unknown user role.';
              break;
          }
          return NextResponse.redirect(`${origin}${redirectPath}`);
        } else {
          // This can happen if the database trigger for profile creation has a slight delay.
          // We redirect the user to the login page with a helpful message.
          console.warn(`User profile or role not found, likely due to trigger delay for user: ${user.id}`);
          return NextResponse.redirect(`${origin}/login?message=Ihr Profil wird eingerichtet. Bitte versuchen Sie, sich in einem Moment einzuloggen.`);
        }
      }
    }

    console.error('Error exchanging code for session:', exchangeError?.message);
    return NextResponse.redirect(`${origin}/login?message=Could not authenticate user.`);
  }

  // Redirect to login if no code is present
  return NextResponse.redirect(`${origin}/login?message=Authentication failed.`);
}

