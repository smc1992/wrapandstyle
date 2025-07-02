import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServices } from './actions';
import { ServiceForm } from './_components/service-form';
import { ServiceList } from './_components/service-list';

export default async function ServicesDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const services = await getServices(user.id);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Dienstleistungen verwalten</h1>
        <Link href="/dashboard/folierer">
          <Button variant="outline">Zurück zur Übersicht</Button>
        </Link>
      </div>
      <p className="text-gray-600 mb-8">
        Fügen Sie hier die Dienstleistungen hinzu, die Sie anbieten. Diese werden auf Ihrem öffentlichen Profil angezeigt.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ihre Dienstleistungen</h2>
          <ServiceList services={services} userId={user.id} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Neue Dienstleistung hinzufügen</h2>
          <ServiceForm userId={user.id} />
        </div>
      </div>
    </div>
  );
}
