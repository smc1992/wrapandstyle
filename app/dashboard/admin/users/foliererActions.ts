'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// --- ZOD SCHEMA FOR VALIDATION ---
const FoliererFormSchema = z.object({
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
  full_name: z.string().min(2, { message: 'Bitte geben Sie einen vollständigen Namen an.' }),
  company_name: z.string().min(2, { message: 'Bitte geben Sie einen Firmennamen an.' }),
  website: z.string().url({ message: 'Bitte geben Sie eine gültige URL ein.' }).optional().or(z.literal('')),
});

// --- ACTION STATE INTERFACE ---
export type FoliererActionState = {
  message: string;
  type: 'success' | 'error' | 'idle';
  errors?: {
    email?: string[];
    password?: string[];
    full_name?: string[];
    company_name?: string[];
    website?: string[];
    general?: string[];
  } | null;
};

// --- SERVER ACTION: createFolierer ---
export async function createFolierer(
  previousState: FoliererActionState,
  formData: FormData
): Promise<FoliererActionState> {
  const validation = FoliererFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validation.success) {
    return {
      message: 'Validierungsfehler. Bitte überprüfen Sie Ihre Eingaben.',
      type: 'error',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password, full_name, company_name, website } = validation.data;
  const supabaseAdmin = createAdminClient();

  // Step 1: Create the user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // User is created by admin, so we can confirm the email directly
    user_metadata: {
      full_name: full_name,
      role: 'folierer',
    },
  });

  if (authError) {
    console.error('Auth Error:', authError.message);
    // Check for specific, common errors
    if (authError.message.includes('User already registered')) {
        return { message: 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.', type: 'error', errors: { email: ['Diese E-Mail ist bereits vergeben.'] } };
    }
    return { message: `Fehler beim Erstellen des Benutzers: ${authError.message}`, type: 'error' };
  }

  if (!authData.user) {
    return { message: 'Benutzer konnte nicht erstellt werden, keine Benutzerdaten zurückgegeben.', type: 'error' };
  }

  const userId = authData.user.id;

  try {
    // Step 2: Create the profile in the 'profiles' table
    // This step is now handled by the database trigger `create_user_profile_and_role`

    // Step 3: Update the 'folierer' table with additional info
    const { error: foliererError } = await supabaseAdmin
      .from('folierer')
      .update({
        firma: company_name,
        webseite: website,
      })
      .eq('user_id', userId);

    if (foliererError) {
      console.error('Folierer Update Error:', foliererError.message);
      throw new Error('Der Benutzer wurde erstellt, aber die Folierer-Profilinformationen konnten nicht gespeichert werden.');
    }

  } catch (error: unknown) {
    // If any step after user creation fails, we should delete the auth user to avoid orphans.
    await supabaseAdmin.auth.admin.deleteUser(userId);
    const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
    return { message: errorMessage, type: 'error' };
  }

  revalidatePath('/dashboard/admin/users');
  redirect('/dashboard/admin/users');
}
