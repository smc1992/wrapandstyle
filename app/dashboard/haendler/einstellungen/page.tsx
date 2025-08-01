import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HaendlerEditForm } from '@/components/dashboard/haendler-edit-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DeleteAccountForm } from '@/components/dashboard/delete-account-form'
import { deleteHaendlerAccount } from '../actions'

export default async function EinstellungenPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // In parallel, fetch the profile, all brands, and all categories
  const [
    { data: haendlerProfile, error: profileFetchError },
    { data: allBrands, error: brandsError },
    { data: allProductCategories, error: categoriesError },
  ] = await Promise.all([
    supabase
      .from('haendler')
      .select(`
        *,
        haendler_brands ( brands ( id, name ) ),
        haendler_product_categories ( product_categories ( id, name ) )
      `)
      .eq('user_id', user.id)
      .single(),
    supabase.from('brands').select('id, name').order('name'),
    supabase.from('product_categories').select('id, name').order('name'),
  ]);

  if (profileFetchError) {
    console.error(`Haendler EinstellungenPage: Error fetching full profile for user ${user.id}:`, profileFetchError);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Error Loading Profile</h1>
        <p className="text-gray-700">We couldn&apos;t load your detailed profile information. Please try again later.</p>
        <p className="text-sm text-gray-500">Details: {profileFetchError?.message || brandsError?.message || categoriesError?.message}</p>
        <Link href={`/dashboard/haendler`}><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  if (!haendlerProfile) {
    console.error(`Haendler EinstellungenPage: CRITICAL - Haendler profile data not found for user ${user.id}.`);
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold text-red-600">Profile Data Missing</h1>
        <p className="text-gray-700">Your detailed profile information could not be found. Please contact support.</p>
        <Link href={`/dashboard/haendler`}><Button variant="outline" className="mt-4">Back to Dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profil bearbeiten</h1>
            <p className="text-gray-600 mb-8">
              Hier können Sie Ihre Profildaten aktualisieren.
            </p>
            <HaendlerEditForm 
              userId={user.id} 
              profile={haendlerProfile} 
              allBrands={allBrands || []} 
              allProductCategories={allProductCategories || []} 
            />
            <div className="mt-8 text-center">
              <Link href={`/dashboard/haendler`}>
                <Button variant="outline">Zurück zur Übersicht</Button>
              </Link>
            </div>
        </div>
        <DeleteAccountForm deleteAction={deleteHaendlerAccount} />
    </div>
  );
}
