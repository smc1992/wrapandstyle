'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createFolierer, FoliererActionState } from './foliererActions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const initialState: FoliererActionState = {
  message: '',
  type: 'idle',
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? 'Wird erstellt...' : 'Folierer erstellen'}
    </Button>
  );
}

export function CreateFoliererForm() {
  const [state, formAction] = useFormState(createFolierer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.type === 'error') {
      toast({
        title: 'Fehler',
        description: state.message,
        variant: 'destructive',
      });
    } 
    // Success is handled by redirect, no toast needed here.
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Vollständiger Name</Label>
          <Input id="full_name" name="full_name" type="text" required />
          {state.errors?.full_name && (
            <p className="text-sm text-red-500">{state.errors.full_name.join(', ')}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Firma</Label>
          <Input id="company_name" name="company_name" type="text" required />
          {state.errors?.company_name && (
            <p className="text-sm text-red-500">{state.errors.company_name.join(', ')}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" name="email" type="email" required />
          {state.errors?.email && (
            <p className="text-sm text-red-500">{state.errors.email.join(', ')}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Initialpasswort</Label>
          <Input id="password" name="password" type="password" required />
          {state.errors?.password && (
            <p className="text-sm text-red-500">{state.errors.password.join(', ')}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="website">Webseite (optional)</Label>
          <Input id="website" name="website" type="url" placeholder="https://beispiel.de" />
          {state.errors?.website && (
            <p className="text-sm text-red-500">{state.errors.website.join(', ')}</p>
          )}
        </div>
      </div>
      <SubmitButton />
       {state.type === 'error' && state.message && !state.errors && (
        <p className="text-sm text-red-500 mt-2">{state.message}</p>
      )}
    </form>
  );
}
