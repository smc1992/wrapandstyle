'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod schema for certificate validation
const CertificateSchema = z.object({
  title: z.string().min(1, 'Der Titel ist erforderlich.'),
  issuer: z.string().min(1, 'Der Aussteller ist erforderlich.'),
  issue_date: z.string().optional(), // Date is optional and comes as string from form
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'Ein Bild ist erforderlich.')
    .refine((file) => file.size <= 4 * 1024 * 1024, 'Die Bildgröße darf 4 MB nicht überschreiten.')
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
      'Ungültiger Dateityp. Nur PNG, JPEG und WEBP sind erlaubt.'
    ).optional(),
});

export async function addCertificate(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: 'Authentifizierung fehlgeschlagen.',
      errors: null,
    };
  }

  const rawFormData = {
    title: formData.get('title'),
    issuer: formData.get('issuer'),
    issue_date: formData.get('issue_date'),
    image: formData.get('image') as File,
  };

  // Make image optional if the file size is 0
  const refinedSchema = CertificateSchema.superRefine((data, ctx) => {
    if (data.image && data.image.size === 0) {
        data.image = undefined;
    }
  });

  const validation = refinedSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Bitte überprüfen Sie Ihre Eingaben.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { title, issuer, issue_date, image } = validation.data;
  let imageUrl = null;
  let storagePath = null;

  // Handle image upload if an image is provided
  if (image) {
    const fileExtension = image.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExtension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, image);

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError.message);
      return { success: false, message: `Fehler beim Hochladen des Bildes: ${uploadError.message}`, errors: null };
    }

    storagePath = uploadData.path;

    const { data: publicUrlData } = supabase.storage
      .from('certificates')
      .getPublicUrl(storagePath);
    
    imageUrl = publicUrlData.publicUrl;
  }

  // Insert data into the database
  const { error: dbError } = await supabase.from('certificates').insert({
    user_id: user.id,
    title,
    issuer,
    issue_date: issue_date || null,
    image_url: imageUrl,
    storage_path: storagePath,
  });

  if (dbError) {
    console.error('Database Insert Error:', dbError.message);
    return { success: false, message: `Fehler beim Speichern in der Datenbank: ${dbError.message}`, errors: null };
  }

  revalidatePath('/dashboard/folierer/zertifikate');
  redirect('/dashboard/folierer/zertifikate');

  return {
    success: true,
    message: 'Zertifikat erfolgreich hinzugefügt!',
    errors: null,
  };
}
