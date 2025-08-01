'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function deleteHaendlerAccount(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user:', userError?.message);
    return { error: 'Benutzer nicht gefunden oder nicht authentifiziert.' };
  }

  const userId = user.id;

  // Händler-Profile haben aktuell keine zugehörigen Storage-Objekte (z.B. Logos), die gelöscht werden müssten.

  // Löscht den Benutzer aus auth.users. Dies löst eine Kaskade aus, die die Einträge
  // in den Tabellen 'profiles' und 'haendler' aufgrund der Foreign-Key-Constraints entfernt.
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error('Error deleting user:', deleteError.message);
    return { error: 'Fehler beim Löschen des Benutzerkontos.' };
  }

  revalidatePath('/dashboard');
  return { error: null };
}
