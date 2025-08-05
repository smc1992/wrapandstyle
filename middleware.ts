import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// --- Configuration ---

// Define paths that should be excluded from password protection.
const PASSWORD_PROTECT_EXCLUDED_PATHS = [
  '/password', // The password entry page itself
  '/api/password-protect', // The API route for checking the password
  '/login', // Supabase login page
  '/auth', // Supabase auth routes
];

export async function middleware(request: NextRequest) {
  // --- 1. Password Protection ---
  const password = process.env.WEBSITE_PASSWORD;
  if (password && password.length > 0) {
    const { pathname } = request.nextUrl;
    const hasCookie = request.cookies.has('password_protected');

    // Check if the current path is a static asset or an excluded path.
    const isStaticAsset = pathname.startsWith('/_next/') || pathname.startsWith('/images/') || pathname.startsWith('/fonts/') || pathname === '/favicon.ico';
    const isExcluded = PASSWORD_PROTECT_EXCLUDED_PATHS.some(path => pathname.startsWith(path));

    if (!hasCookie && !isStaticAsset && !isExcluded) {
      const originalUrl = request.nextUrl.pathname + request.nextUrl.search;
      const url = request.nextUrl.clone();
      url.pathname = '/password';
      url.search = `?redirect=${encodeURIComponent(originalUrl)}`;
      return NextResponse.redirect(url);
    }
  }

  // --- 2. Supabase SSR and Auth Logic ---
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is being set, update the response
          // so the browser receives the updated cookie
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is being removed, update the response
          // so the browser receives the updated cookie
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Custom logic for protecting admin/team routes
  if (request.nextUrl.pathname.startsWith('/dashboard/admin') || request.nextUrl.pathname.startsWith('/dashboard/team')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'team')) {
      return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This matcher is intentionally broad to allow both password protection
     * and Supabase auth to work correctly. The logic inside the middleware
     * handles the specific path exclusions.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
