'use client';

import { useActionState } from 'react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addCertificate } from '@/app/dashboard/folierer/zertifikate/actions';

type FormState = {
  success: boolean;
  message: string;
  errors: {
    title?: string[];
    issuer?: string[];
    issue_date?: string[];
    image?: string[];
  } | null;
};

const initialState: FormState = {
  success: false,
  message: '',
  errors: null,
};

export default function CertificateForm() {
    const [state, formAction] = useActionState(addCertificate, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Erfolg!',
          description: state.message,
        });
        formRef.current?.reset();
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
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Titel des Zertifikats</Label>
        <Input id="title" name="title" placeholder="z.B. Certified Installer" required />
        {state.errors?.title && <p className="text-sm text-red-500">{state.errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="issuer">Ausstellende Organisation</Label>
        <Input id="issuer" name="issuer" placeholder="z.B. Avery Dennison" required />
        {state.errors?.issuer && <p className="text-sm text-red-500">{state.errors.issuer}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue_date">Ausstellungsdatum (optional)</Label>
        <Input id="issue_date" name="issue_date" type="date" />
        {state.errors?.issue_date && <p className="text-sm text-red-500">{state.errors.issue_date}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Bild des Zertifikats (optional)</Label>
        <Input id="image" name="image" type="file" accept="image/png, image/jpeg, image/webp" />
        {state.errors?.image && <p className="text-sm text-red-500">{state.errors.image}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit">Zertifikat speichern</Button>
      </div>
    </form>
  );
}
