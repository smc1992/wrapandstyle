'use client'

import { deleteHerstellerAccount } from '@/app/dashboard/hersteller/actions';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function DeleteHerstellerAccountButton() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmation = window.confirm(
      'Sind Sie sicher, dass Sie Ihr Konto endgültig löschen möchten? Alle Ihre Daten, inklusive Logo und Profil, werden unwiderruflich entfernt.'
    );

    if (confirmation) {
      startTransition(async () => {
        const result = await deleteHerstellerAccount();
        if (result?.error) {
          toast.error(result.error);
        }
      });
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={isPending}
      aria-disabled={isPending}
    >
      {isPending ? 'Wird gelöscht...' : 'Konto endgültig löschen'}
    </Button>
  );
}
