"use client";

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { resetUserPassword } from '@/app/dashboard/admin/users/actions';

const initialState = {
  success: false,
  error: null,
  message: null,
};

export function ResetPasswordAction({ email, children }: { email: string, children: React.ReactNode }) {
  const [state, formAction] = useActionState(resetUserPassword, initialState);

  useEffect(() => {
    if (state?.success && state.message) {
      toast.success(state.message);
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="w-full">
        <input type="hidden" name="email" value={email} />
        <button type="submit" className="w-full text-left">
            {children}
        </button>
    </form>
  );
}
