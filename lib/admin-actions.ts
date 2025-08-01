'use server';

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Define max file size and accepted image types
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Updated Zod schema to match the new form structure
const UserSchema = z.object({
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail an." }),
  password: z.string().min(6, { message: "Das Passwort muss mindestens 6 Zeichen lang sein." }),
  role: z.enum(['folierer', 'haendler', 'hersteller', 'superadmin'], { required_error: 'Bitte wählen Sie eine Rolle.' }),
  firma: z.string().optional(),
  ansprechpartner: z.string().optional(),
  phone_number: z.string().optional(), // Corrected field name
  webseite: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal('')),
  address: z.string().optional(), // Consolidated address field
  services: z.string().optional(), // Consolidated services field
  company_description: z.string().optional(),
  mission_statement: z.string().optional(),
  vision_statement: z.string().optional(),
  company_history: z.string().optional(),
  video_url: z.string().url({ message: "Bitte geben Sie eine gültige URL ein." }).optional().or(z.literal('')),
  // Fields for other roles
  product_categories: z.string().optional(),
  brands: z.string().optional(),
  // Edge Runtime-kompatible Validierung ohne File-API
  logo: z
    .any()
    .optional()
    .refine((file) => !file || !file.size || file.size <= 5 * 1024 * 1024, `Das Logo darf maximal 5MB groß sein.`)
    .refine(
      (file) => !file || !file.size || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Nur .jpeg, .png und .webp Formate sind erlaubt.'
    ),
  portfolio_images: z.array(z.any()).optional(),
});

export type CreateUserState = {
  errors?: z.ZodError<z.infer<typeof UserSchema>>['formErrors']['fieldErrors'];
  message?: string | null;
};

export async function createUserByAdmin(prevState: CreateUserState, formData: FormData): Promise<CreateUserState> {

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { message: 'Server-Umgebung ist nicht für Admin-Aktionen konfiguriert.' };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const validatedFields = UserSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Ungültige Eingabe. Bitte prüfen Sie das Formular.',
    };
  }

  const { email, password, role, logo, portfolio_images, ...profileData } = validatedFields.data;

  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email as admin is creating the user
    user_metadata: { role },
  });

  if (authError) {
    console.error('Admin Auth Error:', authError);
    return { message: `Benutzer konnte nicht erstellt werden: ${authError.message}` };
  }

  const newUser = authData.user;
  if (!newUser) {
    return { message: 'Benutzer konnte nicht erstellt werden, kein Benutzerobjekt von Supabase erhalten.' };
  }

  // The trigger 'create_user_profile_and_role' handles the initial insert into the role table.
  // Now, we update the new row with the detailed profile data from the form.

  let logoUrl = null;

  // 2. Handle Logo Upload if a file is provided
  if (logo && logo.size > 0) {
    // Determine the correct bucket based on the role
    let bucketName = '';
    if (role === 'folierer') {
      bucketName = 'logos-folierer';
    } else if (role === 'haendler') {
      bucketName = 'logos-haendler';
    } else if (role === 'hersteller') {
      bucketName = 'logos-hersteller';
    }

    if (bucketName) {
      const fileExtension = logo.name.split('.').pop();
      const filePath = `${newUser.id}/logo_${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(filePath, logo, {
          cacheControl: '3600',
          upsert: true, // Overwrite if file already exists
        });

      if (uploadError) {
        console.error('Logo Upload Error:', uploadError);
        // Continue without a logo, but notify the admin.
        return { message: `Benutzer erstellt, aber Logo konnte nicht hochgeladen werden: ${uploadError.message}` };
      } else {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl(filePath);
        logoUrl = publicUrlData.publicUrl;
      }
    }
  }

  // Handle portfolio images for folierer
  if (role === 'folierer' && portfolio_images && portfolio_images.length > 0) {
    const portfolioImages = portfolio_images;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
    
    for (const imageFile of portfolioImages) {
      if (imageFile.size > MAX_FILE_SIZE || !ACCEPTED_IMAGE_TYPES.includes(imageFile.type)) {
        // Edge Runtime-kompatible Version - Fallback für Dateinamen
        const fileName = imageFile.name || `image-${new Date().getTime()}`;
        console.warn(`Skipping invalid portfolio file (size or type): ${fileName}`);
        continue;
      }

      // Edge Runtime-kompatible Version - Fallback für Dateinamen
      const fileName = imageFile.name || `image-${new Date().getTime()}`;
      const filePath = `${newUser.id}/${new Date().getTime()}_${fileName.replace ? fileName.replace(/[^a-zA-Z0-9_.-]/g, '') : fileName}`;
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('portfolio-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        // Edge Runtime-kompatible Version - Fallback für Dateinamen
        const fileName = imageFile.name || `image-${new Date().getTime()}`;
        console.error(`Failed to upload portfolio image ${fileName}:`, uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabaseAdmin.storage.from('portfolio-images').getPublicUrl(filePath);

      if (!publicUrl) {
        console.error(`Failed to get public URL for ${filePath}`);
        continue;
      }

      const { error: dbError } = await supabaseAdmin
        .from('portfolio_images')
        .insert({ 
          user_id: newUser.id, 
          title: imageFile.name || `Bild-${new Date().getTime()}`,
          image_url: publicUrl, 
          storage_path: filePath 
        });
      
      if (dbError) {
        console.error(`Failed to insert portfolio image metadata for ${imageFile.name}:`, dbError);
        await supabaseAdmin.storage.from('portfolio-images').remove([filePath]);
      }
    }
  }

  // 3. Prepare the data for the role-specific table update
  const updateData: { [key: string]: any } = { ...profileData };
  if (logoUrl) {
    updateData.logo_url = logoUrl;
  }

  // Convert comma-separated strings to arrays where needed
  if (role === 'folierer' && profileData.services) {
    updateData.services = profileData.services.split(',').map(s => s.trim()).filter(s => s);
  }
  if (role === 'haendler') {
    if (profileData.product_categories) {
      updateData.product_categories = profileData.product_categories.split(',').map(c => c.trim()).filter(c => c);
    }
    if (profileData.brands) {
      updateData.brands = profileData.brands.split(',').map(b => b.trim()).filter(b => b);
    }
  }

  // 4. Update the role-specific table
  if (role !== 'superadmin') {
      const { error: updateError } = await supabaseAdmin
        .from(role) // Dynamic table name based on role
        .update(updateData)
        .eq('user_id', newUser.id);

      if (updateError) {
        console.error(`Admin Role Table Update Error for ${role}:`, updateError);
        return { message: `Benutzerkonto erstellt, aber Profildetails konnten nicht gespeichert werden: ${updateError.message}` };
      }
  }

  // 5. Success: Revalidate and Redirect
  revalidatePath('/dashboard/admin/users');
  redirect('/dashboard/admin/users');
}
