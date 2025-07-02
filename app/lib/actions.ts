'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string().optional(),
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
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Team Member.',
    };
  }

    const { id, name, role, email, phone, image } = validatedFields.data;
  let existingMember = null;

  if (id) {
    const { data, error } = await supabase.from('team_members').select('*').eq('id', id).single();
    if (error) {
      console.error('Database Error:', error);
      return { message: 'Database Error: Failed to fetch existing team member.' };
    }
    existingMember = data;
  }
    let imageUrl = existingMember?.image_url || '';
  let imagePath = existingMember?.storage_path || '';

    if (image && image.size > 0) {
    // If there's an existing image, delete it from storage first
    if (existingMember?.storage_path) {
      await supabase.storage.from('team-avatars').remove([existingMember.storage_path]);
    }
    const file = image as File;
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('team-avatars')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Storage Error:', uploadError);
      return { message: 'Database Error: Failed to upload image.' };
    }
    
    imagePath = uploadData.path;
    const { data: publicUrlData } = supabase.storage
      .from('team-avatars')
      .getPublicUrl(imagePath);
      
    imageUrl = publicUrlData.publicUrl;
    }

    const memberData = {
    name,
    role,
    email,
    phone,
    image_url: imageUrl,
    storage_path: imagePath,
  };

  try {
    if (id) {
      // Update existing member
      const { error } = await supabase.from('team_members').update(memberData).eq('id', id);
      if (error) throw error;
    } else {
      // Insert new member
      const { error } = await supabase.from('team_members').insert(memberData);
      if (error) throw error;
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: `Database Error: Failed to ${id ? 'Update' : 'Create'} Team Member.` };
  }

  revalidatePath('/dashboard/team');
  return { message: `Successfully ${id ? 'updated' : 'created'} team member.`, errors: {} };
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
