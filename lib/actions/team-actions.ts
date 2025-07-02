'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  role: z.string().min(2, { message: 'Rolle muss mindestens 2 Zeichen lang sein.' }),
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  image: z.instanceof(File).optional()
});

export async function createTeamMember(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Fehler bei der Validierung. Bitte überprüfen Sie Ihre Eingaben.',
    };
  }

  const { name, role, email, phone, image } = validatedFields.data;
  let imageUrl = null;

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${name.toLowerCase().replace(/ /g, '-')}-${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('team-images')
      .upload(fileName, image);

    if (uploadError) {
      console.error('Storage Error:', uploadError);
      return { message: 'Fehler beim Hochladen des Bildes.' };
    }
    
    const { data: publicUrlData } = supabase.storage.from('team-images').getPublicUrl(fileName);
    imageUrl = publicUrlData.publicUrl;
  }

  const { error: dbError } = await supabase.from('team_members').insert([
    { name, role, email, phone, image_url: imageUrl },
  ]);

  if (dbError) {
    console.error('Database Error:', dbError);
    return { message: 'Datenbankfehler beim Erstellen des Teammitglieds.' };
  }

  revalidatePath('/dashboard/team');
  return { message: 'Teammitglied erfolgreich erstellt.' };
}
