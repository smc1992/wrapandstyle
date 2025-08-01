'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text: string;
  pendingText?: string;
}

export function SubmitButton({ text, pendingText = 'Wird gespeichert...' }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? pendingText : text}
    </button>
  );
}
