'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog'
import { useToast } from '@/components/ui/use-toast'

interface DeleteAccountFormProps {
  deleteAction: () => Promise<{ error: string | null }>
}

export function DeleteAccountForm({ deleteAction }: DeleteAccountFormProps) {
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)

    const result = await deleteAction()

    if (result.error) {
      toast({
        title: 'Fehler',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Erfolg',
        description: 'Ihr Account wird gelöscht. Sie werden in Kürze abgemeldet.',
      })
      // Optional: Redirect the user after a delay
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    }

    setIsPending(false)
  }

  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
      <h3 className="text-lg font-semibold text-destructive">Gefahrenzone</h3>
      <p className="mt-2 text-sm text-destructive/80">
        Das Löschen Ihres Accounts ist eine endgültige und unwiderrufliche Aktion. Alle Ihre Daten, einschließlich Profile, Bilder und Einstellungen, werden dauerhaft entfernt.
      </p>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="mt-4">
            Meinen Account endgültig löschen
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sich absolut sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Alle Ihre Daten werden dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <form onSubmit={handleSubmit}>
              <AlertDialogAction type="submit" disabled={isPending}>
                {isPending ? 'Lösche...' : 'Ja, Account löschen'}
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
