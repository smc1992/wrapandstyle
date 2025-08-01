"use client";

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser, ActionState } from '@/app/dashboard/admin/users/actions';
import { Loader2 } from 'lucide-react';

const initialState: ActionState = {
  message: '',
  type: 'idle',
};

export function DeleteUserDialog({ userId, role, children }: { userId: string; role: string; children: React.ReactNode }) {
  // The form only contains the button, so we pass the userId via FormData
  const [state, formAction, isPending] = useActionState(deleteUser, initialState);

    useEffect(() => {
    if (state.type === 'success' && state.message) {
      toast.success(state.message);
    }
    if (state.type === 'error' && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion kann nicht rückgängig gemacht werden. Dadurch werden der Benutzer, sein Profil, seine Rollendaten und alle zugehörigen Dateien (Logos, Banner, Portfoliobilder usw.) endgültig gelöscht.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="userId" value={userId} />
            <input type="hidden" name="role" value={role} />
            <Button variant="destructive" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Löschen
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
