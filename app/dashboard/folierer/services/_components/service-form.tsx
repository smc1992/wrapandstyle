'use client'

import { useEffect, useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { upsertService } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/components/ui/card'

interface ServiceFormProps {
  userId: string
  // TODO: Add service prop for editing
}

const initialState = {
  success: false,
  message: '',
  errors: null as Record<string, string[]> | null,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Speichern...' : 'Dienstleistung speichern'}
    </Button>
  )
}

export function ServiceForm({ userId }: ServiceFormProps) {
  const [state, formAction] = useActionState(upsertService.bind(null, userId), initialState)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({
          title: 'Erfolg',
          description: state.message,
        })
        formRef.current?.reset() // Reset form on success
      } else {
        toast({
          title: 'Fehler',
          description: state.message || 'Ein unbekannter Fehler ist aufgetreten.',
          variant: 'destructive',
        })
      }
    }
  }, [state, toast])

  return (
    <Card>
      <CardContent className="pt-6">
        <form ref={formRef} action={formAction} className="space-y-6">
          {/* Hidden input for ID, for editing later */}
          {/* <input type="hidden" name="id" value={service?.id} /> */}

          <div className="space-y-2">
            <Label htmlFor="title">Titel der Dienstleistung</Label>
            <Input id="title" name="title" placeholder="z.B. Scheibentönung" required />
            {state?.errors?.title && <p className="text-sm text-red-500 mt-1">{state.errors.title.join(', ')}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Beschreiben Sie hier, was diese Dienstleistung ausmacht."
              className="min-h-[100px]"
              required
            />
            {state?.errors?.description && <p className="text-sm text-red-500 mt-1">{state.errors.description.join(', ')}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Optional)</Label>
            <Input id="icon" name="icon" placeholder="z.B. ri-film-line" />
             <p className="text-sm text-muted-foreground">
              Name eines Icons von <a href="https://remixicon.com/" target="_blank" rel="noopener noreferrer" className="underline">RemixIcon</a>.
            </p>
            {state?.errors?.icon && <p className="text-sm text-red-500 mt-1">{state.errors.icon.join(', ')}</p>}
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
