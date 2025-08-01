'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, { message: 'Name is required.' }),
  role: z.string().min(1, { message: 'Position is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).optional().or(z.literal('')),
  phone: z.string().optional(),
  image: z.any().optional(),
});

const UpsertTeamMember = FormSchema;

export type State = {
  errors?: {
    name?: string[];
    role?: string[];
    image?: string[];
    email?: string[];
    phone?: string[];
  };
  message?: string | null;
};

export async function upsertTeamMember(prevState: State, formData: FormData): Promise<State> {
  console.log('\n--- [Action] upsertTeamMember: Starting ---');
  const supabase = await createClient();

  const validatedFields = UpsertTeamMember.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    role: formData.get('role'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    image: formData.get('image'),
  });

  if (!validatedFields.success) {
    console.error('[Action] Validation failed:', validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Team Member.',
    };
  }
  console.log('[Action] Validation successful. Data:', validatedFields.data);

  const { id, name, role, email, phone, image } = validatedFields.data;
  let existingMember = null;

  if (id) {
    console.log(`[Action] Mode: Update. Fetching member with ID: ${id}`);
    const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
    if (error) {
      console.error('[Action] DB Error fetching existing member:', error);
      return { message: 'Database Error: Failed to fetch existing team member.' };
    }
    existingMember = data;
    console.log('[Action] Found existing member:', existingMember);
  } else {
    console.log('[Action] Mode: Create new member.');
  }

  let imageUrl = existingMember?.image_url || '';
  let imagePath = existingMember?.storage_path || '';

  if (image && image.size > 0) {
    console.log('[Action] New image detected. Uploading...');
    if (existingMember?.storage_path) {
      console.log(`[Action] Deleting old image from storage: ${existingMember.storage_path}`);
      await supabase.storage.from('team-avatars').remove([existingMember.storage_path]);
    }
    // Edge Runtime-kompatible Version ohne File-API
    const fileName = `${Date.now()}-image`;
    console.log(`[Action] Uploading file: ${fileName}`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('team-avatars')
      .upload(fileName, image);

    if (uploadError) {
      console.error('[Action] Storage upload error:', uploadError);
      return { message: 'Database Error: Failed to upload image.' };
    }
    
    imagePath = uploadData.path;
    const { data: publicUrlData } = supabase.storage.from('team-avatars').getPublicUrl(imagePath);
    imageUrl = publicUrlData.publicUrl;
    console.log(`[Action] Image uploaded. Path: ${imagePath}, URL: ${imageUrl}`);
  } else {
    console.log('[Action] No new image to upload.');
  }

  const memberData = { name, role, email, phone, image_url: imageUrl, storage_path: imagePath };
  console.log('[Action] Prepared data for DB:', memberData);

  try {
    if (id) {
      console.log('[Action] Executing UPDATE...');
      const { error } = await supabase.from('team_members').update(memberData).eq('id', id);
      if (error) throw error;
      console.log('[Action] UPDATE successful.');
    } else {
      console.log('[Action] Executing INSERT...');
      const { data: insertData, error } = await supabase.from('team_members').insert(memberData).select();
      if (error) {
        console.error('[Action] INSERT failed inside try block:', error);
        throw error;
      }
      console.log('[Action] INSERT successful. Returned data:', insertData);
    }
  } catch (error) {
    console.error('[Action] CATCH BLOCK TRIGGERED. Database operation failed:', error);
    return { message: `Database Error: Failed to ${id ? 'Update' : 'Create'} Team Member. See server logs for details.` };
  }

  console.log('[Action] Revalidating path: /dashboard/team');
  revalidatePath('/dashboard/team');
  
  console.log('--- [Action] upsertTeamMember: Finished Successfully ---\n');
  redirect('/dashboard/team');
}

export async function resetPasswordForUser(email: string) {
  'use server';

  if (!email) {
    console.error('[Action] resetPasswordForUser: Email is missing.');
    return { message: 'Error: Email is required.' };
  }

  console.log(`[Action] resetPasswordForUser: Attempting to send reset email to ${email}`);

  const supabase = await createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error(`[Action] resetPasswordForUser: Supabase error for email ${email}:`, error);
    return { message: `Error: Failed to send password reset email. ${error.message}` };
  }

  console.log(`[Action] resetPasswordForUser: Successfully sent password reset email to ${email}`);
  return { message: `Successfully sent password reset email to ${email}.` };
}

export async function deleteTeamMember(id: string) {
  const supabase = await createClient();

  try {
    // First, get the storage path of the image to delete it from storage
    const { data: member, error: selectError } = await supabase
      .from('team_members')
      .select('storage_path')
      .eq('id', id)
      .single();

    if (selectError) {
      console.error('Database Error (select):', selectError);
      throw new Error('Failed to fetch team member for deletion.');
    }

    // If there's an image in storage, remove it
    if (member?.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('team-avatars')
        .remove([member.storage_path]);
      
      if (storageError) {
        console.error('Storage Error:', storageError);
        // Don't block deletion if storage fails, but log it
      }
    }

    // Then, delete the member record from the database
    const { error: deleteError } = await supabase.from('team_members').delete().match({ id });

    if (deleteError) {
      console.error('Database Error (delete):', deleteError);
      throw new Error('Failed to delete team member.');
    }

    revalidatePath('/dashboard/team');
    return { message: 'Successfully deleted team member.' };

  } catch (error) {
    console.error('Overall Error:', error);
    return { message: 'Database Error: Failed to delete team member.' };
  }
}
