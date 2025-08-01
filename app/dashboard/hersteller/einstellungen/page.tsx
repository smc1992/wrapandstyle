import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HerstellerEditForm } from '@/components/dashboard/hersteller-edit-form';
import { DeleteHerstellerAccountButton } from '@/components/dashboard/delete-hersteller-button';
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HerstellerEinstellungenPage() {
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
    .single()

  if (profileFetchError) {
    console.error(`HerstellerEinstellungenPage: Error fetching full profile for user ${user.id}:`, profileFetchError);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Profile</h1>
        <p className="text-gray-700">We couldn&apos;t load your detailed profile information. Please try again later.</p>
        <p className="text-sm text-gray-500">Details: {profileFetchError.message}</p>
        <Link href={`/dashboard/hersteller`}><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  if (!herstellerProfile) {
    console.error(`HerstellerEinstellungenPage: CRITICAL - Hersteller profile data not found for user ${user.id}.`);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Profile Data Missing</h1>
        <p className="text-gray-700">Your detailed profile information could not be found. This is unexpected. Please contact support with User ID: {user.id}.</p>
        <Link href={`/dashboard/hersteller`}><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profil bearbeiten</h1>
        <p className="text-gray-600 mb-8">
          Hier können Sie Ihre Profildaten aktualisieren.
        </p>
        <HerstellerEditForm userId={user.id} profile={herstellerProfile} />
        <div className="mt-12 border-t border-red-200 pt-6">
          <h2 className="text-xl font-semibold text-red-700">Konto löschen</h2>
          <p className="mt-2 text-sm text-gray-600">
            Achtung: Diese Aktion kann nicht rückgängig gemacht werden. Wenn Sie Ihr Konto löschen, werden alle Ihre Profildaten, Ihr Logo und alle zugehörigen Informationen dauerhaft von unserer Plattform entfernt.
          </p>
          <div className="mt-4">
            <DeleteHerstellerAccountButton />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href={`/dashboard/hersteller`}>
            <Button variant="outline">Zurück zur Übersicht</Button>
          </Link>
        </div>
    </div>
  );
}
