'use server';

import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/utils';

// Shared form state for server actions
export interface FormState {
  message: string;
  errors?: {
    [key: string]: string[] | undefined;
  };
}

// Base schema for manufacturer data
const HerstellerBaseSchema = z.object({
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  firma: z.string().min(2, { message: 'Firmenname ist erforderlich.' }),
  website: z.string().url({ message: 'Bitte geben Sie eine gültige URL ein.' }).optional().or(z.literal('')), 
  adresse: z.string().min(5, { message: 'Adresse ist erforderlich.' }),
  plz: z.string().min(4, { message: 'PLZ ist erforderlich.' }),
  ort: z.string().min(2, { message: 'Ort ist erforderlich.' }),
});

// Schema for creating a new manufacturer (password is required)
const CreateHerstellerSchema = HerstellerBaseSchema.extend({
  password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
});

// Schema for updating an existing manufacturer (password is optional)
const UpdateHerstellerSchema = HerstellerBaseSchema.extend({
    password: z.string().min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }).optional().or(z.literal(''))
});

/**
 * Server action to create a new manufacturer user.
 */
export async function createHersteller(prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = CreateHerstellerSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: 'Fehler: Eingaben sind ungültig.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const supabase = await createAdminClient();
    const { email, password, firma, website, adresse, plz, ort } = validatedFields.data;
    const slug = slugify(firma);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // User is created by admin, so we can confirm the email directly
        user_metadata: { role: 'hersteller' },
    });

    if (authError) {
        return { message: `Fehler beim Erstellen des Benutzers: ${authError.message}` };
    }

    const userId = authData.user.id;

    // The trigger 'create_user_profile_and_role' creates the initial entries.
    // Here, we update them with the detailed form data.
    const { error: profileError } = await supabase.from('profiles').update({ full_name: firma, website }).eq('id', userId);
    if (profileError) return { message: `Fehler beim Aktualisieren des Profils: ${profileError.message}` };

    const { error: herstellerError } = await supabase.from('hersteller').update({ firma, slug, adresse, plz, ort }).eq('user_id', userId);
    if (herstellerError) return { message: `Fehler beim Aktualisieren der Herstellerdaten: ${herstellerError.message}` };

    revalidatePath('/dashboard/admin/users');
    redirect('/dashboard/admin/users');
}

/**
 * Server action to update an existing manufacturer user.
 */
export async function updateHersteller(userId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = UpdateHerstellerSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return {
            message: 'Fehler: Eingaben sind ungültig.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const supabase = await createAdminClient();
    const { email, password, firma, website, adresse, plz, ort } = validatedFields.data;
    const slug = slugify(firma);

    // Update auth data (email/password)
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
        email: email,
        ...(password && { password: password }), // Only include password if it's provided
    });
    if (authError) return { message: `Fehler bei Authentifizierungs-Update: ${authError.message}` };

    // Update profiles table
    const { error: profileError } = await supabase.from('profiles').update({ full_name: firma, website }).eq('id', userId);
    if (profileError) return { message: `Fehler beim Aktualisieren des Profils: ${profileError.message}` };

    // Update hersteller table
    const { error: herstellerError } = await supabase.from('hersteller').update({ firma, slug, adresse, plz, ort }).eq('user_id', userId);
    if (herstellerError) return { message: `Fehler beim Aktualisieren der Herstellerdaten: ${herstellerError.message}` };

    revalidatePath('/dashboard/admin/users');
    revalidatePath(`/dashboard/admin/users/${userId}/edit`);
    return { message: 'Benutzer erfolgreich aktualisiert.' };
}
