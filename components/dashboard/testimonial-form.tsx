'use client';

import { useActionState } from 'react';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { addTestimonial } from '@/app/dashboard/folierer/testimonials/actions';

// Define a type for the form state to provide strong typing
type FormState = {
  success: boolean;
  message: string;
  errors: {
    author_name?: string[];
    author_company?: string[];
    testimonial_text?: string[];
  } | null;
};

const initialState: FormState = {
  success: false,
  message: '',
  errors: null,
};

export default function TestimonialForm() {
    const [state, formAction] = useActionState(addTestimonial, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Erfolg!',
          description: state.message,
        });
      } else {
        toast({
          title: 'Fehler',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="author_name">Name des Kunden</Label>
        <Input id="author_name" name="author_name" placeholder="Max Mustermann" required />
        {state.errors?.author_name && <p className="text-sm text-red-500">{state.errors.author_name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author_company">Firma des Kunden (optional)</Label>
        <Input id="author_company" name="author_company" placeholder="Musterfirma GmbH" />
        {state.errors?.author_company && <p className="text-sm text-red-500">{state.errors.author_company}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="testimonial_text">Text des Testimonials</Label>
        <Textarea
          id="testimonial_text"
          name="testimonial_text"
          placeholder="Schreiben Sie hier die Kundenstimme..."
          required
          rows={6}
        />
        {state.errors?.testimonial_text && <p className="text-sm text-red-500">{state.errors.testimonial_text}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Testimonial speichern</Button>
      </div>
    </form>
  );
}
