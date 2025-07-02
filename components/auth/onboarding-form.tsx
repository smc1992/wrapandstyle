'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

type UserRole = 'folierer' | 'vertrieb' | 'hersteller'

export default function OnboardingForm({ user }: { user: User }) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedRole) {
      setError('Bitte wählen Sie eine Rolle aus.')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: selectedRole, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      console.error('Error updating profile:', updateError)
      setLoading(false)
    } else {
      // Redirect to the dashboard after successful role selection
      router.push('/dashboard')
      router.refresh() // Refresh the page to ensure the new state is loaded
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup onValueChange={(value) => setSelectedRole(value as UserRole)} className="space-y-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="folierer" id="folierer" />
          <Label htmlFor="folierer">Ich bin ein Folierer</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="vertrieb" id="vertrieb" />
          <Label htmlFor="vertrieb">Ich bin ein Vertriebspartner</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hersteller" id="hersteller" />
          <Label htmlFor="hersteller">Ich bin ein Hersteller</Label>
        </div>
      </RadioGroup>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading || !selectedRole}>
        {loading ? 'Speichern...' : 'Weiter zum Dashboard'}
      </Button>
    </form>
  )
}
