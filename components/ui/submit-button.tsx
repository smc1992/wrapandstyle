'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} {...props}>
      {pending ? 'Wird gespeichert...' : children}
    </Button>
  )
}
