import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HaendlerDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Verify user has the correct role
  const { data: roleEntry, error: roleError } = await supabase
    .from('haendler')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (roleError && roleError.code !== 'PGRST116') {
    console.error(`HaendlerDashboardPage: Error fetching role entry for user ${user.id}:`, roleError);
    return (
      <div>
        <h1>Error Verifying Role</h1>
        <p>There was an issue confirming your account type. Please try again later.</p>
        <p>Details: {roleError.message}</p>
      </div>
    );
  }

  if (!roleEntry) {
    console.warn(`HaendlerDashboardPage: User ${user.id} attempted to access dashboard but no 'haendler' role entry found. Redirecting.`);
    return redirect('/dashboard');
  }

  // Fetch the complete haendler profile data
  const { data: haendlerProfile, error: profileFetchError } = await supabase
    .from('haendler')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileFetchError) {
    console.error(`HaendlerDashboardPage: Error fetching full profile for user ${user.id}:`, profileFetchError);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Profile</h1>
        <p>We couldn&apos;t load your detailed profile information.</p>
        <p className="text-sm text-gray-500">Details: {profileFetchError.message}</p>
        <Link href="/"><Button variant="outline" className="mt-4">Go to Homepage</Button></Link>
      </div>
    );
  }

  if (!haendlerProfile) {
    console.error(`HaendlerDashboardPage: CRITICAL - Profile data not found for user ${user.id}`);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Profile Data Missing</h1>
        <p>Your detailed profile information could not be found. Please contact support.</p>
        <Link href="/"><Button variant="outline" className="mt-4">Go to Homepage</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Übersicht
          </h1>
        </div>
        <p className="text-lg text-gray-700 mb-2">
          Willkommen, <span className="font-medium text-primary">{user.email}</span>!
        </p>
        <p className="text-gray-600 mb-6">
          Hier können Sie Ihre Händlerdaten einsehen und bearbeiten.
        </p>

        <div className="space-y-6 mb-8 border-t pt-6 mt-6">
          {haendlerProfile.company_description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500">Über das Unternehmen</h2>
              <p className="text-lg text-gray-800 whitespace-pre-wrap mt-1">{haendlerProfile.company_description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Firma</h2>
              <p className="text-lg text-gray-800">{haendlerProfile.firma || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Ansprechpartner</h2>
              <p className="text-lg text-gray-800">{haendlerProfile.ansprechpartner || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Telefon</h2>
              <p className="text-lg text-gray-800">{haendlerProfile.phone_number || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Webseite</h2>
              <p className="text-lg text-gray-800 truncate">
                {haendlerProfile.webseite ? (
                  <a href={haendlerProfile.webseite.startsWith('http') ? haendlerProfile.webseite : `https://${haendlerProfile.webseite}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {haendlerProfile.webseite}
                  </a>
                ) : 'N/A'}
              </p>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-sm font-medium text-gray-500">Adresse</h2>
              <p className="text-lg text-gray-800">
                {haendlerProfile.address || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href={`/dashboard/haendler/einstellungen`}>
            <Button variant="default" size="lg">Profil bearbeiten</Button>
          </Link>
          {haendlerProfile.slug && (
            <Link href={`/haendler/${haendlerProfile.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg">Öffentliches Profil ansehen</Button>
            </Link>
          )}
           <Link href="/">
            <Button variant="outline">Zur Startseite</Button>
          </Link>
        </div>
    </div>
  );
}
