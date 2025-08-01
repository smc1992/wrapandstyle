import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HerstellerDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch the complete hersteller profile data
  const { data: herstellerProfile, error: profileFetchError } = await supabase
    .from('hersteller')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileFetchError) {
    console.error(`HerstellerDashboardPage: Error fetching full profile for user ${user.id}:`, profileFetchError);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Profile</h1>
        <p className="text-gray-700">We couldn&apos;t load your detailed profile information. Please try again later.</p>
        <p className="text-sm text-gray-500">Details: {profileFetchError.message}</p>
        <Link href="/"><Button variant="outline" className="mt-4">Go to Homepage</Button></Link>
      </div>
    );
  }

  if (!herstellerProfile) {
    console.error(`HerstellerDashboardPage: CRITICAL - Hersteller profile data not found for user ${user.id}.`);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Profile Data Missing</h1>
        <p className="text-gray-700">Your detailed profile information could not be found. Please contact support with User ID: {user.id}.</p>
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
          Hier können Sie Ihre Herstellerdaten einsehen und bearbeiten.
        </p>

        <div className="space-y-6 mb-8 border-t pt-6 mt-6">
          {herstellerProfile.company_description && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-sm font-medium text-gray-500">Über das Unternehmen</h2>
              <p className="text-lg text-gray-800 whitespace-pre-wrap mt-1">{herstellerProfile.company_description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">Firma</h2>
              <p className="text-lg text-gray-800">{herstellerProfile.firma || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Ansprechpartner</h2>
              <p className="text-lg text-gray-800">{herstellerProfile.ansprechpartner || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Telefon</h2>
              <p className="text-lg text-gray-800">{herstellerProfile.phone_number || 'N/A'}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Webseite</h2>
              <p className="text-lg text-gray-800 truncate">
                {herstellerProfile.webseite ? (
                  <a href={herstellerProfile.webseite.startsWith('http') ? herstellerProfile.webseite : `https://${herstellerProfile.webseite}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {herstellerProfile.webseite}
                  </a>
                ) : 'N/A'}
              </p>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-sm font-medium text-gray-500">Adresse</h2>
              <p className="text-lg text-gray-800">
                {herstellerProfile.address || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href={`/dashboard/hersteller/einstellungen`}>
            <Button variant="default" size="lg">Profil bearbeiten</Button>
          </Link>
          {herstellerProfile.slug && (
            <Link href={`/hersteller/${herstellerProfile.slug}`} target="_blank" rel="noopener noreferrer">
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
