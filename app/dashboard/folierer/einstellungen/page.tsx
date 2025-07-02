import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FoliererEditForm } from '@/components/dashboard/folierer-edit-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function EinstellungenPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch the complete folierer profile data
  const { data: foliererProfile, error: profileFetchError } = await supabase
    .from('folierer')
    .select('*, company_description, services, address, phone_number, mission_statement, vision_statement, company_history')
    .eq('user_id', user.id)
    .single()

  if (profileFetchError) {
    console.error(`EinstellungenPage: Error fetching full profile for user ${user.id}:`, profileFetchError);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Profile</h1>
        <p className="text-gray-700">We couldn&apos;t load your detailed profile information. Please try again later.</p>
        <p className="text-sm text-gray-500">Details: {profileFetchError.message}</p>
        <Link href={`/dashboard/folierer`}><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  if (!foliererProfile) {
    // This case should ideally not happen if the user is on this page, but as a safeguard:
    console.error(`EinstellungenPage: CRITICAL - Folierer profile data not found for user ${user.id}.`);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Profile Data Missing</h1>
        <p className="text-gray-700">Your detailed profile information could not be found. This is unexpected. Please contact support with User ID: {user.id}.</p>
        <Link href={`/dashboard/folierer`}><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profil bearbeiten</h1>
        <p className="text-gray-600 mb-8">
          Hier können Sie Ihre Profildaten aktualisieren.
        </p>
        <FoliererEditForm userId={user.id} profile={foliererProfile} />
        <div className="mt-8 text-center">
          <Link href={`/dashboard/folierer`}>
            <Button variant="outline">Zurück zur Übersicht</Button>
          </Link>
        </div>
    </div>
  );
}
