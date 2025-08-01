"use server";

import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Zod schema for Haendler creation form validation
const HaendlerFormSchema = z.object({
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
  firma: z.string().min(1, { message: 'Firmenname ist ein Pflichtfeld.' }),
  website: z.string().url({ message: 'Bitte geben Sie eine gültige URL ein.' }).optional().or(z.literal('')),
  phone_number: z.string().optional(),
  address: z.string().min(1, { message: 'Adresse ist ein Pflichtfeld.' }),
});

export type FormState = {
  message: string;
  errors: {
    email?: string;
    password?: string;
    firma?: string;
    website?: string;
    address?: string;
  } | Record<string, any>;
};

export async function createHaendler(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const validatedFields = HaendlerFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    firma: formData.get('firma'),
    website: formData.get('website'),
    phone_number: formData.get('phone_number'),
    address: formData.get('address'),
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
        address: fieldErrors.address?.[0],
      },
    };
  }

  const { email, password, firma, website, phone_number, address } = validatedFields.data;

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

  // Step 2: Update profile and role-specific table.
  // The trigger 'create_user_profile_and_role' handles the initial inserts.

  const { error: profileUpdateError } = await supabaseAdmin
    .from('profiles')
    .update({ 
      role: 'haendler',
      company_name: firma,
      full_name: firma,
      website: website,
     })
    .eq('id', userId);

  if (profileUpdateError) {
    console.error('Profile Update Error:', profileUpdateError);
    return { message: `Fehler beim Aktualisieren des Profils: ${profileUpdateError.message}`, errors: {} };
  }

  const { error: haendlerUpdateError } = await supabaseAdmin
    .from('haendler')
    .update({
      address: address,
      phone_number: phone_number,
      webseite: website
    })
    .eq('user_id', userId);

  if (haendlerUpdateError) {
    console.error('Händler Update Error:', haendlerUpdateError);
    return { message: `Fehler beim Aktualisieren der Händler-Daten: ${haendlerUpdateError.message}`, errors: {} };
  }

  revalidatePath('/dashboard/admin/users');
  redirect('/dashboard/admin/users');
}
