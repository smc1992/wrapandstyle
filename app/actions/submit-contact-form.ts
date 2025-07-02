'use server';

import { redirect } from 'next/navigation';
import * as z from 'zod';

// We define a schema for the data coming from the form
const formSchema = z.object({
  'your-name': z.string(),
  'your-email': z.string().email(),
  'your-subject': z.string(),
  'your-message': z.string().optional(),
});

export async function submitContactForm(data: z.infer<typeof formSchema>) {
  const formData = new FormData();
  formData.append('your-name', data['your-name']);
  formData.append('your-email', data['your-email']);
  formData.append('your-subject', data['your-subject']);
  formData.append('your-message', data['your-message'] || '');

  // Securely get config from server-side environment variables
  const numericId = process.env.WPCF7_NUMERIC_ID;
  const unitTag = process.env.WPCF7_UNIT_TAG;
  const version = process.env.WPCF7_VERSION;
  const locale = process.env.WPCF7_LOCALE;
  const apiUrl = process.env.WORDPRESS_API_URL;

  if (!numericId || !unitTag || !version || !locale || !apiUrl) {
    console.error('Server configuration is incomplete. Please check environment variables.');
    return {
      status: 'error',
      message: 'Die Server-Konfiguration ist unvollständig.',
    };
  }

  formData.append('_wpcf7', numericId);
  formData.append('_wpcf7_version', version);
  formData.append('_wpcf7_locale', locale);
  formData.append('_wpcf7_unit_tag', unitTag);

  try {
    const response = await fetch(`${apiUrl}/wp-json/contact-form-7/v1/contact-forms/${numericId}/feedback`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorResult = await response.json();
      console.error('CF7 API Error:', errorResult);
      return {
        status: 'error',
        message: errorResult.message || 'Ein Fehler ist aufgetreten.',
      };
    }

    const result = await response.json();

    // Check if the form submission was successful according to Contact Form 7
    if (result.status !== 'mail_sent') {
      return {
        status: 'error',
        message: result.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      };
    }

  } catch (error) {
    console.error('An unexpected network error occurred:', error);
    return {
      status: 'error',
      message: 'Ein unerwarteter Netzwerkfehler ist aufgetreten.',
    };
  }

  // If the try block completes without returning an error, it means success.
  // Now, we can safely redirect.
  redirect('/kontakt/danke');
}

