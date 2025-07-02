import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Helper to create a Supabase client that can be used in Server-side Components, API routes, and middleware.
const createSupabaseMiddlewareClient = (request: NextRequest, response: NextResponse) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createSupabaseMiddlewareClient(request, response);
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Define admin-only paths that require a 'superadmin' role
  const adminPaths = ['/dashboard/admin', '/dashboard/team'];

  // Rule 1: Protect all dashboard routes if user is not logged in
  if (!user && pathname.startsWith('/dashboard')) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Rule 2: Handle routes for logged-in users
  if (user) {
    // Redirect logged-in users away from the login/register page
    if (pathname === '/login' || pathname === '/register') {
      const url = new URL('/dashboard', request.url);
      return NextResponse.redirect(url);
    }

    // Rule 3: Protect admin paths
    if (adminPaths.some(path => pathname.startsWith(path))) {
      // Fetch user's role from the profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // If role is not 'superadmin', redirect them away
      if (error || profile?.role !== 'superadmin') {
        console.log(`Middleware: Access DENIED for user ${user.id} to ${pathname}. Role: ${profile?.role}. Redirecting.`);
        const url = new URL('/dashboard', request.url);
        // Optionally add an error message to the query params to display on the dashboard
        url.searchParams.set('error', 'unauthorized_access');
        return NextResponse.redirect(url);
      }

      console.log(`Middleware: Access GRANTED for superadmin ${user.id} to ${pathname}.`);
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/revalidate|images|fonts|.*\\..*).*)',
  ],
};
