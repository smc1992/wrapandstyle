'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z, ZodIssue } from 'zod'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect(`/login?status=error&message=${encodeURIComponent(error.message)}`)
  }

  return redirect('/dashboard')
}

export async function loginWithMagicLink(formData: FormData) {
  const email = formData.get('email') as string
  const supabase = await createClient()
  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin')

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return redirect(`/login?status=error&message=${encodeURIComponent(error.message)}`)
  }

  return redirect(`/login?status=success&message=${encodeURIComponent('Magic Link wurde versendet. Bitte prüfen Sie Ihr Postfach.')}`)
}

// Define the schema for the form data
const signupSchema = z
  .object({
    email: z.string().email({ message: 'Ungültige E-Mail-Adresse.' }),
    password: z
      .string()
      .min(8, { message: 'Das Passwort muss mindestens 8 Zeichen lang sein.' }),
    confirmPassword: z.string(),
    role: z.enum(['hersteller', 'folierer', 'haendler']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Die Passwörter stimmen nicht überein.',
    path: ['confirmPassword'],
  })

export async function signup(formData: FormData) {
  const data = Object.fromEntries(formData)
  const parsed = signupSchema.safeParse(data)

  if (!parsed.success) {
    const errorMessages = parsed.error.issues
      .map((issue: ZodIssue) => issue.message)
      .join(' ')
    return redirect(`/login?status=error&message=${encodeURIComponent(errorMessages)}`)
  }

  const { email, password, role } = parsed.data

  const supabase = await createClient()
  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        role: role,
      },
    },
  })

  if (error) {
    return redirect(
      `/login?status=error&message=${encodeURIComponent(`Fehler bei der Registrierung: ${error.message}`)}`
    )
  }

  return redirect(
    `/login?status=success&message=${encodeURIComponent('Bestätigungs-E-Mail gesendet. Bitte überprüfen Sie Ihr Postfach.')}`
  )
}