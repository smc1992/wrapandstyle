import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(
      'DashboardPage: User not authenticated, redirecting to /login.',
      userError
    );
    // The redirect function throws an error, so this function will not continue.
    // Returning it satisfies TypeScript's control flow analysis.
    return redirect('/login');
  }

  console.log(
    `DashboardPage: User ${user.id} authenticated. Fetching profile with role.`
  );

  // Fetch the user's profile and role directly from the 'profiles' table.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error(
      `DashboardPage: Error fetching profile for user ${user.id}:`,
      profileError
    );
    // Handle case where profile doesn't exist, which is unexpected after login.
    if (profileError.code === 'PGRST116') {
      // 'No rows found'
      console.error(
        `DashboardPage: CRITICAL - Profile not found for user ${user.id}.`
      );
      return (
        <div>
          <h1>Account Setup Incomplete</h1>
          <p>Your account profile could not be found. This is unexpected.</p>
          <p>
            Please try logging out and logging back in. If the problem
            persists, contact support with User ID: {user.id}. (Code:
            DP_NOPROF_V2)
          </p>
        </div>
      );
    }
    return (
      <div>
        <h1>Account Error</h1>
        <p>
          There was an error loading your profile information. Please try again
          later.
        </p>
        <p>
          Details: {profileError.message} (Code: DP_PFERR_V2)
        </p>
      </div>
    );
  }

  const userRole = profile?.role;

  if (!userRole) {
    console.error(
      `DashboardPage: User ${user.id} has a profile but no role is set.`
    );
    return (
      <div>
        <h1>Account Role Issue</h1>
        <p>
          We couldn&apos;t determine your account type. Your profile is missing a
          role.
        </p>
        <p>
          If you have just registered, please try logging out and logging back
          in. If the problem persists, please contact support with your User
          ID: {user.id}. (Code: DP_NOROLE_V2)
        </p>
      </div>
    );
  }

  // Redirect based on the role.
  console.log(
    `DashboardPage: User ${user.id} has role: "${userRole}". Redirecting from /dashboard...`
  );
  // Redirect to the role-specific dashboard
  if (userRole === 'superadmin') {
    return redirect('/dashboard/admin');
  }

  const validRoles = ['folierer', 'hersteller', 'haendler'];
  if (validRoles.includes(userRole)) {
    return redirect(`/dashboard/${userRole}`);
  }

  // Fallback for any other roles that might not have a specific dashboard yet
  console.warn(
    `DashboardPage: User ${user.id} has an unhandled role: "${userRole}". Redirecting to homepage.`
  );
  return redirect('/');
}
