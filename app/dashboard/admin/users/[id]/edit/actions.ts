"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const roleSchema = z.object({
  role: z.enum(['superadmin', 'hersteller', 'folierer', 'haendler']),
});

export async function updateUserRole(
  id: string,
  prevState: { success: boolean; error: string | null; message: string | null },
  formData: FormData
) {
  const supabase = await createClient();

  const validation = roleSchema.safeParse({ role: formData.get('role') });

  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid role selected.',
      message: null,
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: validation.data.role })
    .eq('id', id);

  if (error) {
    return {
      success: false,
      error: `Could not update role: ${error.message}`,
      message: null,
    };
  }

  revalidatePath('/dashboard/admin/users');
  revalidatePath(`/dashboard/admin/users/${id}/edit`);

  return {
    success: true,
    message: 'User role updated successfully.',
    error: null,
  };
}
