import EditUserForm from './_components/edit-user-form';
import { createClient } from '@/lib/supabase/server';

interface EditUserPageProps {
  params: {
    id: string;
  };
}

async function getUser(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      folierer:folierer ( 
        company_name:firma,
        website:webseite,
        phone_number:telefon,
        address,
        company_description,
        ansprechpartner,
        services,
        video_url,
        logo_url
      ),
      hersteller:hersteller (*),
      haendler:haendler (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  // Supabase returns related tables as an array, even for one-to-one.
  // We need to flatten it for the form.
  if (data) {
    if (Array.isArray(data.folierer) && data.folierer.length > 0) {
      data.folierer = data.folierer[0];
    } else {
      // Ensure the object exists to prevent errors in the form
      data.folierer = {}; 
    }
    if (Array.isArray(data.hersteller) && data.hersteller.length > 0) {
      data.hersteller = data.hersteller[0];
    } else {
      data.hersteller = {};
    }
    if (Array.isArray(data.haendler) && data.haendler.length > 0) {
      data.haendler = data.haendler[0];
    } else {
      data.haendler = {};
    }
  }

  return data;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params;
  const user = await getUser(id);

  if (!user) {
    return <div>Benutzer nicht gefunden.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Benutzerprofil bearbeiten</h1>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
        <EditUserForm user={user} />
      </div>
    </div>
  );
}
