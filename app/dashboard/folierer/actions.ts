'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Helper function to generate a URL-friendly slug
function slugify(text: string): string {
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for Folierer profile updates
const FoliererProfileSchema = z.object({
  firma: z.string().min(1, 'Firmenname ist erforderlich.'),
  ansprechpartner: z.string().min(1, 'Ansprechpartner ist erforderlich.'),
  webseite: z.string().url('Bitte geben Sie eine gültige URL ein.').optional().or(z.literal('')),
  company_description: z.string().max(2000, "Die Beschreibung darf maximal 2000 Zeichen lang sein.").optional(),
  services: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  video_url: z.string().url('Bitte geben Sie eine gültige Video-URL ein.').optional().or(z.literal('')), 
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

export async function updateFoliererProfile(userId: string, prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawFormData = Object.fromEntries(formData.entries());
  const validation = FoliererProfileSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Bitte überprüfen Sie Ihre Eingaben.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { logo, ...profileData } = validation.data;
  let newLogoUrl: string | null = null;

  try {
    if (logo && logo.size > 0) {
      const { data: currentProfile } = await supabase
        .from('folierer')
        .select('logo_url')
        .eq('user_id', userId)
        .single();

      const fileExt = logo.name.split('.').pop();
      const newFileName = `${userId}-${Date.now()}.${fileExt}`;
      const newFilePath = `logos/${newFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos-folierer') // Explicitly correct bucket name
        .upload(newFilePath, logo);

      if (uploadError) throw new Error(`Fehler beim Hochladen des Logos: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from('logos-folierer') // Explicitly correct bucket name
        .getPublicUrl(newFilePath);
      newLogoUrl = publicUrlData.publicUrl;

      if (currentProfile?.logo_url) {
        const oldLogoPath = currentProfile.logo_url.split('/').pop();
        if (oldLogoPath) {
          await supabase.storage.from('logos-folierer').remove([`logos/${oldLogoPath}`]); // Explicitly correct bucket name
        }
      }
    }

    const slug = slugify(profileData.firma);
    const servicesArray = profileData.services ? profileData.services.split(',').map(s => s.trim()).filter(Boolean) : [];

    const updatePayload: any = {
      ...profileData,
      slug,
      services: servicesArray,
      updated_at: new Date().toISOString(),
    };

    if (newLogoUrl) {
      updatePayload.logo_url = newLogoUrl;
    }

    const { error: updateError } = await supabase
      .from('folierer')
      .update(updatePayload)
      .eq('user_id', userId);

    if (updateError) {
      if (updateError.code === '23505') {
        return {
          success: false,
          message: 'Ein Unternehmen mit diesem Namen existiert bereits.',
          errors: { firma: ['Dieser Firmenname ist bereits vergeben.'] },
        };
      }
      throw new Error(`Fehler beim Aktualisieren des Profils: ${updateError.message}`);
    }

    revalidatePath('/dashboard/folierer/einstellungen');
    revalidatePath(`/folierer/${slug}`);

    return {
      success: true,
      message: 'Profil erfolgreich aktualisiert!',
      errors: null,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Ein unerwarteter Fehler ist aufgetreten.',
      errors: null,
    };
  }
}

export async function deleteFoliererAccount(): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error fetching user for deletion:', userError?.message);
    return { error: 'Benutzer nicht gefunden oder nicht authentifiziert.' };
  }

  const userId = user.id;

  try {
    // Step 1: Fetch and delete all portfolio images from storage
    const { data: portfolioImages } = await supabase
      .from('portfolio_images')
      .select('storage_path')
      .eq('user_id', userId);

    if (portfolioImages && portfolioImages.length > 0) {
      const storagePaths = portfolioImages.map(img => img.storage_path).filter(Boolean) as string[];
      if (storagePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('portfolio-images').remove(storagePaths);
        if (storageError) {
          // Log the error but proceed, as the user deletion is more critical
          console.error('Could not delete all portfolio images from storage:', storageError.message);
        }
      }
    }

    // Step 2: Delete the user from auth.users, which cascades to other tables
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      throw new Error(`Fehler beim Löschen des Benutzers: ${deleteError.message}`);
    }

    revalidatePath('/dashboard');
    return { error: null };

  } catch (error: any) {
    console.error('An error occurred during account deletion:', error.message);
    return { error: 'Ein unerwarteter Fehler ist beim Löschen des Kontos aufgetreten.' };
  }
}
