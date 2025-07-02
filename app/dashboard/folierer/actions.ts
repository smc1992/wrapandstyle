'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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

// Updated Zod schema to match the new, consolidated database fields
const FoliererProfileSchema = z.object({
  firma: z.string().min(1, 'Firmenname ist erforderlich.'),
  ansprechpartner: z.string().min(1, 'Ansprechpartner ist erforderlich.'),
  webseite: z.string().url('Bitte geben Sie eine gültige URL ein.').optional().or(z.literal('')),
  company_description: z.string().max(2000, "Die Beschreibung darf maximal 2000 Zeichen lang sein.").optional(),
  services: z.string().optional(), // Comes as a comma-separated string from the form's hidden input
  address: z.string().optional(),
  phone_number: z.string().optional(),
  video_url: z.string().url('Bitte geben Sie eine gültige Video-URL ein (z.B. von YouTube oder Vimeo).').optional().or(z.literal('')), 
  mission_statement: z.string().max(1000, 'Die Mission darf maximal 1000 Zeichen lang sein.').optional(),
  vision_statement: z.string().max(1000, 'Die Vision darf maximal 1000 Zeichen lang sein.').optional(),
  company_history: z.string().max(3000, 'Die Firmengeschichte darf maximal 3000 Zeichen lang sein.').optional(),
});

export async function updateFoliererProfile(userId: string, prevState: any, formData: FormData) {
  const supabase = await createClient()

  const rawFormData = {
    firma: formData.get('firma'),
    ansprechpartner: formData.get('ansprechpartner'),
    webseite: formData.get('webseite'),
    company_description: formData.get('company_description'),
    services: formData.get('services'),
    address: formData.get('address'),
    phone_number: formData.get('phone_number'),
    video_url: formData.get('video_url'),
    mission_statement: formData.get('mission_statement'),
    vision_statement: formData.get('vision_statement'),
    company_history: formData.get('company_history'),
  }

  const validation = FoliererProfileSchema.safeParse(rawFormData)

  if (!validation.success) {
    return {
      success: false,
      message: 'Bitte überprüfen Sie Ihre Eingaben.',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const { firma, ansprechpartner, webseite, company_description, services, address, phone_number, video_url, mission_statement, vision_statement, company_history } = validation.data

  // Generate a URL-friendly slug from the company name
  const slug = slugify(firma);

  // Convert the comma-separated services string into a string array for the DB (text[])
  const servicesArray = services ? services.split(',').map(s => s.trim()).filter(Boolean) : [];

  const { error } = await supabase
    .from('folierer')
    .update({
      firma,
      ansprechpartner,
      slug, // Save the generated slug
      webseite: webseite || null,
      company_description: company_description || null,
      services: servicesArray,
      address: address || null,
      phone_number: phone_number || null,
      video_url: video_url || null,
      mission_statement: mission_statement || null,
      vision_statement: vision_statement || null,
      company_history: company_history || null,
      updated_at: new Date().toISOString(),
      // Set old fields to null to ensure data consistency
      telefon: null,
      spezialisierungen: null,
      strasse_hausnummer: null,
      plz_ort: null,
    })
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating folierer profile:', error)
    // Handle unique constraint violation for slug
    if (error.code === '23505') { // unique_violation
        return {
            success: false,
            message: 'Ein Unternehmen mit einem ähnlichen Namen existiert bereits. Bitte ändern Sie den Firmennamen leicht ab.',
            errors: { firma: ['Dieser Firmenname ist bereits vergeben.'] },
        }
    }
    return {
      success: false,
      message: `Fehler beim Aktualisieren des Profils: ${error.message}`,
      errors: null,
    }
  }

  // Revalidate the settings page, the main dashboard page, and the future public profile page
  revalidatePath('/dashboard/folierer/einstellungen')
  revalidatePath('/dashboard/folierer')
  revalidatePath(`/folierer/${slug}`)
  
  return {
    success: true,
    message: 'Profil erfolgreich aktualisiert!',
    errors: null,
  }
}
