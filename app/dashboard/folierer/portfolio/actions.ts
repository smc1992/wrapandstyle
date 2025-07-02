'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Expanded schema for the entire portfolio/profile form
const FormSchema = z.object({
  youtube_channel_url: z.string().url({
    message: 'Bitte geben Sie eine gültige URL ein.',
  }).optional().or(z.literal('')), 
  company_description: z.string().max(1000, "Die Beschreibung darf maximal 1000 Zeichen lang sein.").optional(),
  address: z.string().min(5, "Bitte geben Sie eine gültige Adresse ein.").optional(),
  phone_number: z.string().min(5, "Bitte geben Sie eine gültige Telefonnummer ein.").optional(),
  services: z.string().optional(), // Received as a comma-separated string
});

// This function updates general portfolio details like the YouTube URL
// This function updates general portfolio details like the YouTube URL
export async function updateFoliererPortfolio(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Authentifizierung fehlgeschlagen.' };
  }

  // Extract all data from the form
  const rawData = {
    youtube_channel_url: formData.get('youtube_channel_url'),
    company_description: formData.get('company_description'),
    address: formData.get('address'),
    phone_number: formData.get('phone_number'),
    services: formData.get('services'),
  };

  const validatedFields = FormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Fehler bei der Validierung der Eingaben.',
    };
  }

  // Prepare data for DB, converting services string to array
  const { services, ...otherData } = validatedFields.data;
  const servicesArray = services
    ? services.split(',').map(s => s.trim()).filter(s => s)
    : [];

  const updateData = {
    ...otherData,
    services: servicesArray,
  };

  const { data, error } = await supabase
    .from('folierer')
    .update(updateData)
    .eq('user_id', user.id);

  if (error) {
    console.error('DB Update Error:', error);
    return { message: 'Datenbankfehler: Portfolio konnte nicht aktualisiert werden.' };
  }

  revalidatePath('/dashboard/folierer/portfolio');
  return { message: 'Profil erfolgreich aktualisiert.' };
}

// This function updates the logo URL
export async function updateLogoUrl(newLogoUrl: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Authentifizierung fehlgeschlagen. Bitte neu einloggen.' };
  }

  const { error: updateError } = await supabase
    .from('folierer')
    .update({ logo_url: newLogoUrl })
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    console.error('DB Update Error (Logo):', updateError);
    if (updateError.message.includes('violates row-level security policy')) {
        return { error: 'Datenbankfehler: Fehlende Berechtigung. Bitte prüfen Sie die Sicherheitseinstellungen (RLS) für die Tabelle `folierer`.' };
    }
    return { error: `Datenbankfehler: ${updateError.message}` };
  }

  revalidatePath('/dashboard/folierer/portfolio');
  return { success: true };
}


// --- Portfolio Images Actions ---

// Schema for validating the uploaded image
const imageSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich.'),
  image: z
    .instanceof(File, { message: 'Bild ist erforderlich.' })
    .refine((file) => file.size > 0, 'Bild ist erforderlich.')
    .refine((file) => file.size <= 5 * 1024 * 1024, `Bild darf maximal 5MB groß sein.`)
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Nur .jpeg, .png und .webp Formate sind erlaubt.'
    ),
});

// New, robust function to add a portfolio image
export async function addPortfolioImage(formData: FormData) {
  console.log('[Action] addPortfolioImage: Gestartet.');

  const validatedFields = imageSchema.safeParse({
    title: formData.get('title'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    console.error('[Action] addPortfolioImage: Validierung fehlgeschlagen.', validatedFields.error.flatten().fieldErrors);
    return { error: validatedFields.error.flatten().fieldErrors.image?.[0] || validatedFields.error.flatten().fieldErrors.title?.[0] || 'Ungültige Eingabe.' };
  }
  const { title, image: imageFile } = validatedFields.data;
  console.log('[Action] addPortfolioImage: Validierung erfolgreich.');

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('[Action] addPortfolioImage: Authentifizierung fehlgeschlagen.', authError);
    return { error: 'Authentifizierung fehlgeschlagen. Bitte erneut einloggen.' };
  }
  console.log(`[Action] addPortfolioImage: Benutzer ${user.id} authentifiziert.`);

  const fileExt = imageFile.name.split('.').pop();
  const filePath = `${user.id}/${new Date().getTime()}.${fileExt}`;
  console.log(`[Action] addPortfolioImage: Lade Datei nach ${filePath} hoch.`);

  const { error: uploadError } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error('[Action] addPortfolioImage: Supabase Storage Upload-Fehler:', uploadError);
    return { error: `Fehler beim Hochladen des Bildes: ${uploadError.message}` };
  }
  console.log('[Action] addPortfolioImage: Storage-Upload erfolgreich.');

  const { data: { publicUrl } } = supabase.storage.from('portfolio-images').getPublicUrl(filePath);

  if (!publicUrl) {
    console.error('[Action] addPortfolioImage: Konnte öffentliche URL nicht abrufen.');
    return { error: 'Konnte die öffentliche URL des Bildes nicht abrufen.' };
  }
  console.log(`[Action] addPortfolioImage: Öffentliche URL erhalten: ${publicUrl}`);

  console.log('[Action] addPortfolioImage: Füge Metadaten in die Datenbank ein.');
  const { error: dbError } = await supabase
    .from('portfolio_images')
    .insert({ user_id: user.id, title, image_url: publicUrl, storage_path: filePath });

  if (dbError) {
    console.error('[Action] addPortfolioImage: Supabase DB Insert-Fehler:', dbError);
    return { error: `Datenbankfehler: ${dbError.message}` };
  }
  console.log('[Action] addPortfolioImage: Datenbankeintrag erfolgreich.');

  revalidatePath('/dashboard/folierer/portfolio');
  console.log('[Action] addPortfolioImage: Pfad revalidiert. Prozess erfolgreich abgeschlossen.');
  return { success: 'Bild erfolgreich hochgeladen!' };
}


// Function to get all portfolio images for the logged-in user
export async function getPortfolioImages() {
  console.log('[Action] getPortfolioImages: Gestartet...');
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('[Action] getPortfolioImages: Benutzer nicht authentifiziert.', authError);
    return { error: 'User not authenticated for getPortfolioImages', data: [] };
  }
  console.log(`[Action] getPortfolioImages: Benutzer ${user.id} authentifiziert. Führe Abfrage aus...`);

  const { data, error } = await supabase
    .from('portfolio_images')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Action] getPortfolioImages: Fehler beim Abrufen der Bilder.', error);
    return { error: 'Error fetching portfolio images', data: [] };
  }
  console.log(`[Action] getPortfolioImages: Abfrage erfolgreich. ${data.length} Bilder gefunden.`);
  return { data, error: null };
}

// Function to delete a portfolio image
export async function deletePortfolioImage(imageId: string, storagePath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Authentifizierung fehlgeschlagen.' };
  }

  // First, delete the image from storage
  const { error: storageError } = await supabase.storage
    .from('portfolio-images')
    .remove([storagePath]);

  if (storageError) {
    console.error('Storage Delete Error (Portfolio Image):', storageError);
    // We log the error but proceed to delete the DB record anyway
  }

  // Then, delete the image record from the database
  const { error: dbError } = await supabase
    .from('portfolio_images')
    .delete()
    .eq('id', imageId)
    .eq('user_id', user.id); // Ensure user can only delete their own images

  if (dbError) {
    console.error('DB Delete Error (Portfolio Image):', dbError);
    return { error: 'Datenbankfehler: Bild konnte nicht aus dem Portfolio gelöscht werden.' };
  }

  revalidatePath('/dashboard/folierer/portfolio');
  return { success: 'Bild erfolgreich gelöscht.' };
}

