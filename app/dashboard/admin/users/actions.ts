'use server';

'use server';

import { createAdminClient, createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// --- HELPER FUNCTION to generate a unique slug ---
async function generateUniqueSlug(supabase: any, companyName: string, userId: string, roleTable: 'folierer' | 'hersteller' | 'haendler'): Promise<string> {
  const generateBaseSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/&/g, 'und')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

  let slug = generateBaseSlug(companyName);
  let isUnique = false;
  let counter = 2;

  while (!isUnique) {
    const { data, error } = await supabase
      .from(roleTable)
      .select('user_id')
      .eq('slug', slug)
      .neq('user_id', userId) // Exclude the current user from the check
      .maybeSingle(); // Use maybeSingle to avoid error on 0 rows

    if (error) {
      // Re-throw the error to be caught by the main try-catch block
      throw new Error(`Slug-Prüfung fehlgeschlagen: ${error.message}`);
    }

    if (!data) {
      isUnique = true; // The slug is unique
    } else {
      slug = `${generateBaseSlug(companyName)}-${counter}`;
      counter++;
    }
  }
  return slug;
}

// --- ZOD SCHEMA FOR USER UPDATE ---
const FoliererSchema = z.object({
  company_name: z.string().optional().nullable(),
  website: z.string().url({ message: 'Bitte eine gültige URL angeben.' }).or(z.literal('')).optional().nullable(),
  phone_number: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  company_description: z.string().optional().nullable(),
  ansprechpartner: z.string().optional().nullable(),
  services: z.string().optional().nullable(),
  video_url: z.string().url({ message: 'Bitte eine gültige YouTube URL angeben.' }).or(z.literal('')).optional().nullable(),
  logo_url: z.string().url().optional().nullable(),
}).optional();

const HerstellerSchema = z.object({
  company_name: z.string().optional().nullable(),
  website: z.string().url().or(z.literal('')).optional().nullable(),
  phone_number: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  company_description: z.string().optional().nullable(),
  ansprechpartner: z.string().optional().nullable(),
  product_categories: z.string().optional().nullable(),
  company_history: z.string().optional().nullable(),
  mission_statement: z.string().optional().nullable(),
  vision_statement: z.string().optional().nullable(),
  youtube_channel_url: z.string().url().or(z.literal('')).optional().nullable(),
}).optional();

const HaendlerSchema = z.object({
  company_name: z.string().optional().nullable(),
  website: z.string().url().or(z.literal('')).optional().nullable(),
  phone_number: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  company_description: z.string().optional().nullable(),
}).optional();

const UpdateFormSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['hersteller', 'folierer', 'haendler', 'superadmin']),
  folierer: FoliererSchema,
  hersteller: HerstellerSchema,
  haendler: HaendlerSchema,
});

// --- ACTION STATE INTERFACE ---
export type ActionState = {
  message: string;
  type: 'success' | 'error' | 'idle';
  errors?: { [key: string]: string[] } | null;
  userId?: string; // Add userId to the state for redirection
};

// --- SERVER ACTION: updateUser ---
export async function updateUser(previousState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const rawData = Object.fromEntries(formData.entries());
  const formObject: { [key: string]: any } = {
    userId: rawData.userId,
    role: rawData.role,
  };

  const foliererData: { [key: string]: any } = {};
  const herstellerData: { [key: string]: any } = {};
  const haendlerData: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(rawData)) {
    if (key.startsWith('folierer.')) {
      foliererData[key.substring(9)] = value;
    } else if (key.startsWith('hersteller.')) {
      herstellerData[key.substring(11)] = value;
    } else if (key.startsWith('haendler.')) {
      haendlerData[key.substring(9)] = value;
    }
  }

  if (Object.keys(foliererData).length > 0) formObject.folierer = foliererData;
  if (Object.keys(herstellerData).length > 0) formObject.hersteller = herstellerData;
  if (Object.keys(haendlerData).length > 0) formObject.haendler = haendlerData;
  const logoFile = formData.get('logo') as File;

  const validation = UpdateFormSchema.safeParse(formObject);

  if (!validation.success) {
    return {
      message: 'Validierungsfehler.',
      type: 'error',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { userId, role, ...validatedData } = validation.data;

  try {
    // Update role in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: role })
      .eq('id', userId);

    if (profileError) throw new Error(`Profil-Update fehlgeschlagen: ${profileError.message}`);

    const roleTable = role;
    if (roleTable !== 'superadmin') {
      let roleData: any = validatedData[role as keyof typeof validatedData] || {};

      // Handle logo upload for folierer
      if (role === 'folierer' && logoFile && logoFile.size > 0) {
        const supabaseAdmin = createAdminClient();
        const filePath = `${userId}/logo-${Date.now()}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from('folierer-logos')
          .upload(filePath, logoFile, {
            upsert: true,
          });

        if (uploadError) {
          throw new Error(`Logo-Upload fehlgeschlagen: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabaseAdmin.storage
          .from('folierer-logos')
          .getPublicUrl(filePath);

        roleData.logo_url = publicUrlData.publicUrl;
      }

      // Special handling for array fields and DB column mapping
      if (role === 'hersteller' && validatedData.hersteller) {
        roleData.product_categories = validatedData.hersteller.product_categories
          ? validatedData.hersteller.product_categories.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];
      }
      if (role === 'folierer' && validatedData.folierer) {
        const foliererDataFromValidation = validatedData.folierer;
        const dbData: { [key: string]: any } = {
            firma: foliererDataFromValidation.company_name,
            webseite: foliererDataFromValidation.website,
            telefon: foliererDataFromValidation.phone_number,
            address: foliererDataFromValidation.address,
            company_description: foliererDataFromValidation.company_description,
            ansprechpartner: foliererDataFromValidation.ansprechpartner,
            services: foliererDataFromValidation.services ? foliererDataFromValidation.services.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
            video_url: foliererDataFromValidation.video_url,
            logo_url: roleData.logo_url || foliererDataFromValidation.logo_url, // Use newly uploaded logo if available
        };

        // Generate a unique slug if company name is provided
        if (dbData.firma) {
          dbData.slug = await generateUniqueSlug(supabase, dbData.firma, userId, 'folierer');
        }

        // Upsert into role-specific table with correct DB column names
        const { error: roleError } = await supabase
            .from('folierer')
            .upsert({ user_id: userId, ...dbData }, { onConflict: 'user_id' });

        if (roleError) throw new Error(`Rollen-Update (folierer) fehlgeschlagen: ${roleError.message}`);

      } else if (role === 'hersteller' && validatedData.hersteller) {
        const herstellerDataFromValidation = validatedData.hersteller;
        const dbData: { [key: string]: any } = {
            firma: herstellerDataFromValidation.company_name,
            webseite: herstellerDataFromValidation.website,
            telefon: herstellerDataFromValidation.phone_number,
            address: herstellerDataFromValidation.address,
            company_description: herstellerDataFromValidation.company_description,
            ansprechpartner: herstellerDataFromValidation.ansprechpartner,
            product_categories: herstellerDataFromValidation.product_categories ? herstellerDataFromValidation.product_categories.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
            company_history: herstellerDataFromValidation.company_history,
            mission_statement: herstellerDataFromValidation.mission_statement,
            vision_statement: herstellerDataFromValidation.vision_statement,
            youtube_channel_url: herstellerDataFromValidation.youtube_channel_url,
        };

        if (dbData.firma) {
          dbData.slug = await generateUniqueSlug(supabase, dbData.firma, userId, 'hersteller');
        }

        const { error: roleError } = await supabase
          .from('hersteller')
          .upsert({ user_id: userId, ...dbData }, { onConflict: 'user_id' });

        if (roleError) throw new Error(`Rollen-Update (hersteller) fehlgeschlagen: ${roleError.message}`);

      } else if (role === 'haendler' && validatedData.haendler) {
        const haendlerDataFromValidation = validatedData.haendler;
        const dbData: { [key: string]: any } = {
            firma: haendlerDataFromValidation.company_name,
            webseite: haendlerDataFromValidation.website,
            telefon: haendlerDataFromValidation.phone_number,
            address: haendlerDataFromValidation.address,
            company_description: haendlerDataFromValidation.company_description,
        };

        if (dbData.firma) {
          dbData.slug = await generateUniqueSlug(supabase, dbData.firma, userId, 'haendler');
        }

        const { error: roleError } = await supabase
          .from('haendler')
          .upsert({ user_id: userId, ...dbData }, { onConflict: 'user_id' });

        if (roleError) throw new Error(`Rollen-Update (haendler) fehlgeschlagen: ${roleError.message}`);
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
    return { message: errorMessage, type: 'error' };
  }

  revalidatePath('/dashboard/admin/users');
  revalidatePath(`/dashboard/admin/users/${userId}/edit`);

  return { message: 'Benutzer erfolgreich aktualisiert.', type: 'success', userId };
}


// --- SERVER ACTION: deleteUser ---
export async function deleteUser(previousState: ActionState, formData: FormData): Promise<ActionState> {
  const userId = formData.get('userId') as string;
  const userRole = formData.get('role') as string;

  if (!userId || !userRole) {
    return { message: 'Benutzer-ID oder Rolle nicht gefunden.', type: 'error' };
  }

  const supabaseAdmin = createAdminClient();

  let logoPathToDelete: string | null = null;

  try {
    // Step 1: BEFORE deleting the user, fetch the logo path if they are a 'hersteller'.
    if (userRole === 'hersteller') {
      const { data: herstellerData, error: fetchError } = await supabaseAdmin
        .from('hersteller')
        .select('logo_storage_path')
        .eq('user_id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching hersteller logo path for deletion:', fetchError);
      }
      if (herstellerData?.logo_storage_path) {
        logoPathToDelete = herstellerData.logo_storage_path;
      }
    }

    // Step 2: Delete the user from the auth.users table.
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      throw new Error(`Fehler beim Löschen des Benutzers: ${authError.message}`);
    }

    // Step 3: If a logo path was found, delete the logo from storage.
    if (logoPathToDelete) {
      const { error: logoDeleteError } = await supabaseAdmin.storage
        .from('logos-hersteller') // Make sure this bucket name is correct
        .remove([logoPathToDelete]);

      if (logoDeleteError) {
        // Log the error but don't block the user deletion process
        console.error(`Konnte Logo nicht löschen (${logoPathToDelete}):`, logoDeleteError.message);
      }
    }

    revalidatePath('/dashboard/admin/users');
    return { message: 'Benutzer erfolgreich gelöscht.', type: 'success' };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
    return { message: errorMessage, type: 'error' };
  }
}
