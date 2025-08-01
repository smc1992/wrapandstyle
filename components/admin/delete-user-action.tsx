"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteUser } from '@/app/dashboard/admin/users/actions';

const initialState = {
  success: false,
  error: null,
  message: null,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" variant="destructive" disabled={pending}>
            {pending ? "Deleting..." : "Yes, delete user"}
        </Button>
    )
}

export function DeleteUserAction({ userId, children }: { userId: string, children: React.ReactNode }) {
      const deleteUserWithId = deleteUser.bind(null, userId);
  const [state, formAction] = useActionState(deleteUserWithId, initialState);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state?.success && state.message) {
      toast.success(state.message);
      setIsOpen(false);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="w-full">
        {children}
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <form action={formAction} className="inline-flex">
              <input type="hidden" name="id" value={userId} />
              <SubmitButton />
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
