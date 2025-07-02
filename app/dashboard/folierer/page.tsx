import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/layout/logout-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


export default async function FoliererDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Verify user has the correct role
  const { data: roleEntry, error: roleError } = await supabase
    .from('folierer')
    .select('user_id') // Correct column to select
    .eq('user_id', user.id) // Correct column for the equality check
    .single();

  if (roleError && roleError.code !== 'PGRST116') { // PGRST116 means no rows found, which is handled by !roleEntry
    console.error(`FoliererDashboardPage: Error fetching role entry for user ${user.id}:`, roleError);
    // Optionally, render a more specific error page or component
    return (
      <div>
        <h1>Error Verifying Role</h1>
        <p>There was an issue confirming your account type. Please try again later.</p>
        <p>Details: {roleError.message}</p>
      </div>
    );
  }

  if (!roleEntry) {
    console.warn(`FoliererDashboardPage: User ${user.id} attempted to access Folierer dashboard but no 'folierer' role entry found. Redirecting to /dashboard.`);
    // Redirect to the main dashboard router if the role is incorrect or no entry found
    return redirect('/dashboard');
  }

  // Fetch the complete folierer profile data
  const { data: foliererProfile, error: profileFetchError } = await supabase
    .from('folierer')
    .select('*') // Select all relevant fields including new ones
    .eq('user_id', user.id)
    .single();

  if (profileFetchError) {
    console.error(`FoliererDashboardPage: Error fetching full profile for user ${user.id}:`, profileFetchError);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Profile</h1>
        <p className="text-gray-700">We couldn&apos;t load your detailed profile information. Please try again later.</p>
        <p className="text-sm text-gray-500">Details: {profileFetchError.message}</p>
        <Link href="/"><Button variant="outline" className="mt-4">Go to Homepage</Button></Link>
      </div>
    );
  }

  if (!foliererProfile) {
    // This case should ideally not happen if roleEntry was found, but as a safeguard:
    console.error(`FoliererDashboardPage: CRITICAL - Folierer profile data not found for user ${user.id} even though role entry exists.`);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Profile Data Missing</h1>
        <p className="text-gray-700">Your detailed profile information could not be found. This is unexpected. Please contact support with User ID: {user.id}.</p>
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
          Hier können Sie Ihre Foliererdaten einsehen und bearbeiten.
        </p>

        <div className="space-y-6 mb-8 border-t pt-6 mt-6">
          {/* Company Description */}
          {foliererProfile.company_description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500">Über das Unternehmen</h2>
              <p className="text-lg text-gray-800 whitespace-pre-wrap mt-1">{foliererProfile.company_description}</p>
            </div>
          )}

          {/* Grid for structured info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Firma</h2>
              <p className="text-lg text-gray-800">{foliererProfile.firma || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Ansprechpartner</h2>
              <p className="text-lg text-gray-800">{foliererProfile.ansprechpartner || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Telefon</h2>
              <p className="text-lg text-gray-800">{foliererProfile.phone_number || foliererProfile.telefon || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Webseite</h2>
              <p className="text-lg text-gray-800 truncate">
                {foliererProfile.webseite ? (
                  <a href={foliererProfile.webseite.startsWith('http') ? foliererProfile.webseite : `https://${foliererProfile.webseite}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {foliererProfile.webseite}
                  </a>
                ) : 'N/A'}
              </p>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-sm font-medium text-gray-500">Adresse</h2>
              <p className="text-lg text-gray-800">
                {foliererProfile.address || [foliererProfile.strasse_hausnummer, foliererProfile.plz_ort].filter(Boolean).join(', ') || 'N/A'}
              </p>
            </div>
          </div>

          {/* Services / Specializations */}
          <div>
            <h2 className="text-sm font-medium text-gray-500">Dienstleistungen & Spezialisierungen</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {(foliererProfile.services && foliererProfile.services.length > 0) ? (
                foliererProfile.services.map((service: string) => (
                  <span key={service} className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full">
                    {service}
                  </span>
                ))
              ) : (
                <p className="text-lg text-gray-500 italic">{foliererProfile.spezialisierungen || 'Keine Angaben'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href={`/dashboard/folierer/einstellungen`}>
            <Button variant="default" size="lg">Profil bearbeiten</Button>
          </Link>
          {foliererProfile.slug && (
            <Link href={`/folierer/${foliererProfile.slug}`} target="_blank" rel="noopener noreferrer">
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
