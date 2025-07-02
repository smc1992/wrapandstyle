'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ServiceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, 'Der Titel muss mindestens 3 Zeichen lang sein.'),
  description: z.string().min(10, 'Die Beschreibung muss mindestens 10 Zeichen lang sein.'),
  icon: z.string().optional(),
});

export async function getServices(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('folierer_services')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return data;
}

export async function upsertService(userId: string, prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    id: formData.get('id') || undefined,
    title: formData.get('title'),
    description: formData.get('description'),
    icon: formData.get('icon'),
  };

  const validation = ServiceSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Bitte überprüfen Sie Ihre Eingaben.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { id, ...serviceData } = validation.data;

  const { error } = await supabase
    .from('folierer_services')
    .upsert({ id, user_id: userId, ...serviceData });

  if (error) {
    console.error('Error upserting service:', error);
    return {
      success: false,
      message: `Fehler beim Speichern der Dienstleistung: ${error.message}`,
      errors: null,
    };
  }

  revalidatePath('/dashboard/folierer/services');
  revalidatePath('/folierer/[slug]', 'layout'); // Revalidate public profile

  return {
    success: true,
    message: 'Dienstleistung erfolgreich gespeichert.',
    errors: null,
  };
}

export async function deleteService(userId: string, serviceId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('folierer_services')
    .delete()
    .eq('user_id', userId) 
    .eq('id', serviceId);

  if (error) {
    console.error('Error deleting service:', error);
    return {
      success: false,
      message: `Fehler beim Löschen der Dienstleistung: ${error.message}`,
    };
  }

  revalidatePath('/dashboard/folierer/services');
  revalidatePath('/folierer/[slug]', 'layout');

  return {
    success: true,
    message: 'Dienstleistung erfolgreich gelöscht.',
  };
}
