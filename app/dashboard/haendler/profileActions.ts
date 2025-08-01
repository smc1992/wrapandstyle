'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper function for slugifying
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

// Constants for logo upload validation
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Zod schema for Händler profile
const HaendlerProfileSchema = z.object({
  firma: z.string().min(1, 'Firmenname ist erforderlich.'),
  ansprechpartner: z.string().min(1, 'Ansprechpartner ist erforderlich.'),
  webseite: z.string().url('Bitte geben Sie eine gültige URL ein.').optional().or(z.literal('')), 
  company_description: z.string().max(2000, "Die Beschreibung darf maximal 2000 Zeichen lang sein.").optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  brands: z.array(z.string()).optional(),
  product_categories: z.array(z.string()).optional(),
  logo: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Die maximale Dateigröße beträgt 3MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Nur .jpg, .jpeg, .png und .webp Formate werden unterstützt.'
    ),
});

// Define the state type for the form
export type State = {
  success: boolean;
  message: string | null;
  errors: Record<string, string[] | undefined> | null;
};

export async function updateHaendlerProfile(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "Nicht autorisiert.", errors: null };
  }
  const userId = user.id;

  const rawFormData = {
    firma: formData.get('firma'),
    ansprechpartner: formData.get('ansprechpartner'),
    webseite: formData.get('webseite'),
    company_description: formData.get('company_description'),
    address: formData.get('address'),
    phone_number: formData.get('phone_number'),
    brands: formData.getAll('brands'), // Use getAll for checkbox groups
    product_categories: formData.getAll('product_categories'), // Use getAll
    logo: formData.get('logo'),
  }

  const validation = HaendlerProfileSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validierungsfehler. Bitte überprüfen Sie Ihre Eingaben.',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { logo, brands, product_categories, ...profileData } = validation.data;
  let logoUrl: string | undefined = undefined;

  // 1. Handle Logo Upload (simplified and robust)
  if (logo && logo.size > 0) {
    const fileExtension = logo.name.split('.').pop();
    const filePath = `${userId}/logo_${Date.now()}.${fileExtension}`;

    const { error: uploadError } = await supabase.storage
      .from('logos-haendler')
      .upload(filePath, logo, { 
        cacheControl: '3600', 
        upsert: true // Atomically replaces the file if it exists, safer.
      });

    if (uploadError) {
      return { success: false, message: `Fehler beim Hochladen des Logos: ${uploadError.message}`, errors: { logo: ['Upload fehlgeschlagen.'] } };
    }
    logoUrl = supabase.storage.from('logos-haendler').getPublicUrl(filePath).data.publicUrl;
  }

  // 2. Update the main 'haendler' table
  const slug = slugify(profileData.firma);
  const updatePayload: any = {
    ...profileData,
    slug,
    updated_at: new Date().toISOString(),
  };

  // Only add logo_url to payload if a new logo was successfully uploaded
  if (logoUrl) {
    updatePayload.logo_url = logoUrl;
  }

  const { error: profileUpdateError } = await supabase
    .from('haendler')
    .update(updatePayload)
    .eq('user_id', userId);

  if (profileUpdateError) {
    return { success: false, message: `Fehler beim Speichern des Profils: ${profileUpdateError.message}`, errors: null };
  }

  // 3. Update Relationships using a Database Function (RPC)
  // This is the most robust way to handle many-to-many updates.
  const brandIds = brands?.map(id => parseInt(id, 10)) || [];
  const categoryIds = product_categories?.map(id => parseInt(id, 10)) || [];

  const { error: relationError } = await supabase.rpc('handle_haendler_relations', {
    p_haendler_id: userId,
    p_brand_ids: brandIds,
    p_category_ids: categoryIds
  });

  if (relationError) {
    return { success: false, message: `Fehler beim Aktualisieren der Verknüpfungen: ${relationError.message}`, errors: null };
  }

  // 4. Revalidate paths and return success
  revalidatePath('/dashboard/haendler/einstellungen');
  revalidatePath(`/haendler/${slug}`);
  revalidatePath('/haendler'); // Revalidate the main directory page

  return { success: true, message: 'Ihr Profil wurde erfolgreich aktualisiert.', errors: null };
}
