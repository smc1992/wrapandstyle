'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('hersteller') // Default role

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitted(false)
    setLoading(true)

    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { role: role }, // Pass the selected role
        },
      })

      if (error) {
        // Handle Supabase-specific errors returned in the object
        throw error
      }

      setSubmitted(true)
    } catch (error: any) {
      // Catch any other exceptions, including network errors
      setError(error.message || 'Ein unerwarteter Fehler ist aufgetreten.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Bitte prüfen Sie Ihr E-Mail-Postfach</h2>
        <p className="text-gray-600">Wir haben Ihnen einen magischen Link zum Anmelden geschickt.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label>Ich bin...</Label>
        <ToggleGroup
          type="single"
          value={role}
          onValueChange={(value: string) => {
            if (value) setRole(value)
          }}
          className="grid grid-cols-3"
        >
          <ToggleGroupItem value="hersteller">Hersteller</ToggleGroupItem>
          <ToggleGroupItem value="folierer">Folierer</ToggleGroupItem>
          <ToggleGroupItem value="haendler">Händler</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          E-Mail-Adresse
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Senden...' : 'Magischen Link senden'}
        </button>
      </div>
    </form>
  )
}
