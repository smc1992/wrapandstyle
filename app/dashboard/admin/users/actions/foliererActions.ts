"use server";

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Zod schema for Folierer creation form validation
const FoliererFormSchema = z.object({
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
  firma: z.string().min(1, { message: 'Firmenname ist ein Pflichtfeld.' }),
  website: z.string().url({ message: 'Bitte geben Sie eine gültige URL ein.' }).optional().or(z.literal('')),
  phone_number: z.string().optional(),
  adresse: z.string().min(1, { message: 'Adresse ist ein Pflichtfeld.' }),
  plz: z.string().min(1, { message: 'PLZ ist ein Pflichtfeld.' }),
  ort: z.string().min(1, { message: 'Ort ist ein Pflichtfeld.' }),
});

export type FormState = {
  message: string;
  errors: {
    email?: string;
    password?: string;
    firma?: string;
    website?: string;
    adresse?: string;
    plz?: string;
    ort?: string;
  } | Record<string, any>;
};

export async function createFolierer(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const validatedFields = FoliererFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    firma: formData.get('firma'),
    website: formData.get('website'),
    phone_number: formData.get('phone_number'),
    adresse: formData.get('adresse'),
    plz: formData.get('plz'),
    ort: formData.get('ort'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Validierungsfehler. Bitte überprüfen Sie Ihre Eingaben.',
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        firma: fieldErrors.firma?.[0],
        website: fieldErrors.website?.[0],
        adresse: fieldErrors.adresse?.[0],
        plz: fieldErrors.plz?.[0],
        ort: fieldErrors.ort?.[0],
      },
    };
  }

  const { email, password, firma, website, phone_number, adresse, plz, ort } = validatedFields.data;

  // Step 1: Create the user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Automatically confirm the email
  });

  if (authError) {
    console.error('Auth Error:', authError);
    return { message: `Fehler beim Erstellen des Benutzers: ${authError.message}`, errors: {} };
  }

  const userId = authData.user.id;

  // Step 2: The trigger 'create_user_profile_and_role' will handle the rest.
  // We just need to insert the role-specific data into the `folierer` table.
  // The trigger will create the profile and then we update it.

  // First, update the profile created by the trigger
  const { error: profileUpdateError } = await supabaseAdmin
    .from('profiles')
    .update({ 
      role: 'folierer',
      company_name: firma,
      full_name: firma, // Use firma as full_name for folierer
      website: website,
     })
    .eq('id', userId);

  if (profileUpdateError) {
    console.error('Profile Update Error:', profileUpdateError);
    return { message: `Fehler beim Aktualisieren des Profils: ${profileUpdateError.message}`, errors: {} };
  }

  // Then, update the folierer table with address details
  const { error: foliererUpdateError } = await supabaseAdmin
    .from('folierer')
    .update({
      strasse_hausnummer: adresse,
      plz_ort: `${plz} ${ort}`,
      phone_number: phone_number,
      webseite: website
    })
    .eq('user_id', userId);

  if (foliererUpdateError) {
    console.error('Folierer Update Error:', foliererUpdateError);
    return { message: `Fehler beim Aktualisieren der Folierer-Daten: ${foliererUpdateError.message}`, errors: {} };
  }

  revalidatePath('/dashboard/admin/users');
  redirect('/dashboard/admin/users');
}
