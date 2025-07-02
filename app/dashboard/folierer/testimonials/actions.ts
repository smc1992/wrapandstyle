'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Zod schema for testimonial validation
const TestimonialSchema = z.object({
  author_name: z.string().min(1, 'Der Name des Kunden ist erforderlich.'),
  author_company: z.string().optional(),
  testimonial_text: z.string().min(10, 'Die Kundenstimme muss mindestens 10 Zeichen lang sein.'),
});

export async function addTestimonial(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      success: false,
      message: 'Authentifizierung fehlgeschlagen. Bitte erneut anmelden.',
      errors: null,
    };
  }

  const rawFormData = {
    author_name: formData.get('author_name'),
    author_company: formData.get('author_company'),
    testimonial_text: formData.get('testimonial_text'),
  };

  const validation = TestimonialSchema.safeParse(rawFormData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Bitte überprüfen Sie Ihre Eingaben.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { author_name, author_company, testimonial_text } = validation.data;

  const { error } = await supabase
    .from('testimonials')
    .insert({
      user_id: user.id,
      author_name,
      author_company: author_company || null,
      testimonial_text,
    });

  if (error) {
    console.error('Error adding testimonial:', error.message);
    return {
      success: false,
      message: `Fehler beim Speichern: ${error.message}`,
      errors: null,
    };
  }

  // Revalidate the testimonials page to show the new entry
  revalidatePath('/dashboard/folierer/testimonials');
  // Redirect back to the testimonials overview page
  redirect('/dashboard/folierer/testimonials');

  // This part is technically unreachable due to redirect, but good for form state structure
  return {
    success: true,
    message: 'Testimonial erfolgreich hinzugefügt!',
    errors: null,
  };
}
