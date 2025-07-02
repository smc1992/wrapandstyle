import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/layout/logout-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function HerstellerDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Verify user has the correct role
  const { data: role } = await supabase
    .from('hersteller')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!role) {
    // Redirect to the main dashboard router if the role is incorrect
    return redirect('/dashboard') 
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-6 bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800">
          Hersteller Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Willkommen, <span className="font-medium text-primary">{user.email}</span>!
        </p>
        <p className="text-gray-500 text-center">
          Hier können Sie Ihre Herstellerdaten verwalten.
        </p>
        <div className="flex space-x-4">
          <LogoutButton />
          <Link href="/">
            <Button variant="outline">Zur Startseite</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
