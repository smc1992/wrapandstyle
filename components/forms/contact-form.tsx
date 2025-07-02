'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { submitContactForm } from '@/app/actions/submit-contact-form';

// Schema für die Formularvalidierung mit Zod
const formSchema = z.object({
  'your-name': z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  'your-email': z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  'your-subject': z.string().min(5, { message: 'Betreff muss mindestens 5 Zeichen lang sein.' }),
  'your-message': z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      'your-name': '',
      'your-email': '',
      'your-subject': '',
      'your-message': '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const result = await submitContactForm(data);

      if (result.status === 'mail_sent') {
        router.push('/kontakt/danke');
      } else {
        toast.error(result.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      toast.error('Ein unerwarteter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
        <div className="text-center p-8 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-2xl font-bold text-green-800">Nachricht gesendet!</h3>
            <p className="mt-2 text-green-700">Vielen Dank für Ihre Kontaktaufnahme. Wir werden uns so schnell wie möglich bei Ihnen melden.</p>
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="your-name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Ihr Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="your-email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="ihre@email.de" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="your-subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Betreff (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Betreff Ihrer Nachricht" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="your-message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nachricht</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ihre Nachricht an uns..."
                  className="resize-none"
                  {...field}
                  rows={7}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Wird gesendet...' : 'Nachricht senden'}
        </Button>
      </form>
    </Form>
  );
}