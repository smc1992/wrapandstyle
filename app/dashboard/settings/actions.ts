"use server";

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const passwordSchema = z.object({
  password: z.string().min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein.'),
  password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Die Passwörter stimmen nicht überein.",
  path: ["password_confirm"], // path of error
});

export async function updateUserPassword(
  prevState: { success: boolean; error: string | null; message: string | null },
  formData: FormData
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
    return {
      success: false,
      error: 'Benutzer nicht authentifiziert.',
      message: null,
    };
  }

  const password = formData.get('password') as string;
  const password_confirm = formData.get('password_confirm') as string;

  const validation = passwordSchema.safeParse({ password, password_confirm });

    if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
      message: null,
    };
  }

  const { error } = await supabase.auth.updateUser({ password: validation.data.password });

    if (error) {
    return {
      success: false,
      error: `Passwort konnte nicht aktualisiert werden: ${error.message}`,
      message: null,
    };
  }

  revalidatePath('/dashboard/settings');
    return {
    success: true,
    message: 'Ihr Passwort wurde erfolgreich aktualisiert.',
    error: null,
  };
}

const emailSchema = z.object({
  email: z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein.'),
});

export async function updateUserEmail(
  prevState: { success: boolean; error: string | null; message: string | null },
  formData: FormData
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: 'Benutzer nicht authentifiziert.',
      message: null,
    };
  }

  const email = formData.get('email') as string;

  const validation = emailSchema.safeParse({ email });

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
      message: null,
    };
  }

  const { error } = await supabase.auth.updateUser({ email: validation.data.email });

  if (error) {
    return {
      success: false,
      error: `E-Mail konnte nicht aktualisiert werden: ${error.message}`,
      message: null,
    };
  }

  revalidatePath('/dashboard/settings');
  return {
    success: true,
    message: 'Eine Bestätigungs-E-Mail wurde an Ihre neue Adresse gesendet. Bitte klicken Sie auf den Link, um die Änderung abzuschließen.',
    error: null,
  };
}
