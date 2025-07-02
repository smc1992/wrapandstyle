'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from './actions'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [role, setRole] = useState('hersteller') // Default role
  const initialState = { message: '', error: null, submitted: false }
  // The `login` function (server action) is passed to useFormState
  const [state, dispatch] = useActionState(login, initialState)

  // useFormStatus must be used inside the form
  // We'll create a simple submit button component to use it
  function SubmitButton() {
    const { pending } = useFormStatus()
    return (
      <Button
        type="submit"
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        aria-disabled={pending}
        disabled={pending}
      >
        {pending ? 'Senden...' : 'Magischen Link senden'}
      </Button>
    )
  }

  useEffect(() => {
    if (state.error) {
      // You can use a toast library or a simple alert to show errors
      alert(`Login Fehler: ${state.error}`)
      console.error("Login Error:", state.error)
    }
    if (state.message && !state.error && !state.submitted) {
        alert(state.message) // For non-error messages like 'Email and role are required'
    }
  }, [state])

  if (state.submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Bitte prüfen Sie Ihr E-Mail-Postfach
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Wir haben Ihnen einen magischen Link zum Anmelden geschickt.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Anmelden oder Registrieren
          </h2>
        </div>
        {/* The form action now calls the dispatch function from useFormState */}
        <form action={dispatch} className="mt-8 space-y-6">
          <input type="hidden" name="role" value={role} />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                name="email" // Name attribute is crucial for FormData
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="ihre@email.de"
              />
            </div>
            <div className="pt-4">
              <Label>Ich bin...</Label>
              <ToggleGroup
                type="single"
                value={role}
                onValueChange={(value: string) => {
                  if (value) setRole(value)
                }}
                className="grid grid-cols-3 pt-2"
              >
                <ToggleGroupItem value="hersteller" aria-label="Hersteller">
                  Hersteller
                </ToggleGroupItem>
                <ToggleGroupItem value="folierer" aria-label="Folierer">
                  Folierer
                </ToggleGroupItem>
                <ToggleGroupItem value="haendler" aria-label="Händler">
                  Händler
                </ToggleGroupItem>
              </ToggleGroup>
              {/* Hidden input to pass role to server action via FormData */}
              <input type="hidden" name="role" value={role} />
            </div>
          </div>

          {/* Display error messages from server action state */}
          {state.message && !state.submitted && (
            <p className={`text-sm text-center ${state.error ? 'text-red-600' : 'text-blue-600'}`}>
              {state.message}
            </p>
          )}

          <div>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  )
}
