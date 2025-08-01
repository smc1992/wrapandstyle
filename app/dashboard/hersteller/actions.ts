'use server'

import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Helper function to generate a URL-friendly slug
function slugify(text: string): string {
  if (!text) return '';
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

// Zod schema for the hersteller profile
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const HerstellerProfileSchema = z.object({
  firma: z.string().min(1, 'Firmenname ist erforderlich.'),
  ansprechpartner: z.string().min(1, 'Ansprechpartner ist erforderlich.'),
  webseite: z.string().url('Bitte geben Sie eine gültige URL ein.').optional().or(z.literal('')), 
  company_description: z.string().max(2000, "Die Beschreibung darf maximal 2000 Zeichen lang sein.").optional(),
  address: z.string().optional(), // Combined address
  phone_number: z.string().optional(),
  product_categories: z.string().optional().transform(val => 
    val ? val.split(',').map(s => s.trim()).filter(Boolean) : []
  ), // Transform comma-separated string to array
  video_url: z.string().url('Bitte geben Sie eine gültige Video-URL ein (z.B. von YouTube oder Vimeo).').optional().or(z.literal('')), 
  mission_statement: z.string().max(1000, 'Die Mission darf maximal 1000 Zeichen lang sein.').optional(),
  vision_statement: z.string().max(1000, 'Die Vision darf maximal 1000 Zeichen lang sein.').optional(),
  company_history: z.string().max(3000, 'Die Firmengeschichte darf maximal 3000 Zeichen lang sein.').optional(),
  logo: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Die Dateigröße darf 5MB nicht überschreiten.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Nur .jpg, .jpeg, .png und .webp Formate werden unterstützt."
    ),
});

export async function updateHerstellerProfile(userId: string, prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    return { success: false, message: 'Berechtigung verweigert.', errors: null };
  }

  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Manually construct the object for validation, combining address fields
  const street = formData.get('street') as string || '';
  const house_number = formData.get('house_number') as string || '';
  const zip_code = formData.get('zip_code') as string || '';
  const city = formData.get('city') as string || '';
  const fullAddress = [street, house_number, zip_code, city].filter(p => p).join(', ');

  const rawFormData = {
    ...Object.fromEntries(formData.entries()),
    address: fullAddress,
  };

  const validation = HerstellerProfileSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Bitte überprüfen Sie Ihre Eingaben.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { logo, ...profileData } = validation.data;
  let newLogoUrl: string | null = null;
  let newLogoStoragePath: string | null = null;

  try {
    const { data: currentProfile, error: fetchError } = await supabaseAdmin
      .from('hersteller')
      .select('logo_storage_path')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Profil konnte nicht geladen werden: ${fetchError.message}`);
    }

    if (logo && logo.size > 0) {
      if (currentProfile?.logo_storage_path) {
        await supabaseAdmin.storage.from('logos-hersteller').remove([currentProfile.logo_storage_path]);
      }
      const fileExt = logo.name.split('.').pop();
      const newFileName = `${userId}-${Date.now()}.${fileExt}`;
      const newFilePath = `logos/${newFileName}`;

      const { error: uploadError } = await supabaseAdmin.storage.from('logos-hersteller').upload(newFilePath, logo);
      if (uploadError) throw new Error(`Fehler beim Hochladen des Logos: ${uploadError.message}`);

      const { data: publicUrlData } = supabaseAdmin.storage.from('logos-hersteller').getPublicUrl(newFilePath);
      newLogoUrl = publicUrlData.publicUrl;
      newLogoStoragePath = newFilePath;
    }

    const slug = slugify(profileData.firma);
    const updatePayload: any = {
      ...profileData,
      slug,
      updated_at: new Date().toISOString(),
    };

    if (newLogoUrl && newLogoStoragePath) {
      updatePayload.logo_url = newLogoUrl;
      updatePayload.logo_storage_path = newLogoStoragePath;
    }

    const { data: updatedData, error: updateError } = await supabaseAdmin
      .from('hersteller')
      .update(updatePayload)
      .eq('user_id', userId)
      .select('slug')
      .single();

    if (updateError) {
      if (updateError.code === '23505') {
        return {
          success: false,
          message: 'Ein Unternehmen mit diesem Namen existiert bereits.',
          errors: { firma: ['Dieser Firmenname ist bereits vergeben.'] },
        };
      }
      return {
        success: false,
        message: `DB-Fehler: ${updateError.message}`,
        errors: null,
      };
    }

    if (!updatedData) {
        return {
            success: false,
            message: `Speicherfehler: Profil für User ${userId} nicht gefunden.`,
            errors: null,
        };
    }

    revalidatePath('/dashboard/hersteller/einstellungen');
    revalidatePath('/dashboard/hersteller');
    if (updatedData.slug) {
        revalidatePath(`/hersteller/${updatedData.slug}`);
    }

    return {
      success: true,
      message: 'Profil erfolgreich aktualisiert!',
      errors: null,
    };

  } catch (error) {
    console.error('Unerwarteter Fehler beim Profil-Update:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Ein unerwarteter Server-Fehler ist aufgetreten.',
      errors: null,
    };
  }
}

export async function deleteHerstellerAccount(): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'Benutzer nicht gefunden.' };
  }

  const userId = user.id;

  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: herstellerProfile } = await supabaseAdmin
    .from('hersteller')
    .select('logo_storage_path')
    .eq('user_id', userId)
    .single();

  if (herstellerProfile?.logo_storage_path) {
    await supabaseAdmin.storage.from('logos-hersteller').remove([herstellerProfile.logo_storage_path]);
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (deleteError) {
    console.error('Fehler beim Löschen des Benutzers:', deleteError.message);
    return { error: 'Fehler beim Löschen des Benutzerkontos.' };
  }

  revalidatePath('/dashboard/hersteller/einstellungen');
  redirect('/');

  return { error: null };
}
