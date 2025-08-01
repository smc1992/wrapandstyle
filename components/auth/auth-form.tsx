'use client'

import { useState } from 'react'
import { login, loginWithMagicLink, signup } from '@/app/(main)/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function AuthForm({ action }: { action: 'login' | 'signup' }) {
  const [role, setRole] = useState('hersteller')
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password')

  return (
    <form className="space-y-6">
      {action === 'signup' && (
        <div className="space-y-2">
          <Label>Ich bin...</Label>
          <ToggleGroup
            type="single"
            defaultValue={role}
            onValueChange={(value) => {
              if (value) setRole(value)
            }}
            className="w-full grid grid-cols-3"
          >
            <ToggleGroupItem value="hersteller">Hersteller</ToggleGroupItem>
            <ToggleGroupItem value="folierer">Folierer</ToggleGroupItem>
            <ToggleGroupItem value="haendler">Händler</ToggleGroupItem>
          </ToggleGroup>
          <input type="hidden" name="role" value={role} />
        </div>
      )}

      {action === 'login' && (
        <div className="space-y-2">
          <Label>Anmeldemethode</Label>
          <ToggleGroup
            type="single"
            value={loginMethod}
            onValueChange={(value: 'password' | 'magic') => {
              if (value) setLoginMethod(value)
            }}
            className="grid w-full grid-cols-2"
          >
            <ToggleGroupItem value="password">Passwort</ToggleGroupItem>
            <ToggleGroupItem value="magic">Magic Link</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">E-Mail-Adresse</Label>
        <Input id="email" name="email" type="email" required />
      </div>

      {(action === 'signup' || (action === 'login' && loginMethod === 'password')) && (
        <div className="grid gap-2">
          <Label htmlFor="password">Passwort</Label>
          <Input id="password" name="password" type="password" required />
        </div>
      )}

      {action === 'signup' && (
        <div className="grid gap-2">
          <Label htmlFor="password_confirm">Passwort bestätigen</Label>
          <Input id="password_confirm" name="confirmPassword" type="password" required />
        </div>
      )}

      {action === 'login' ? (
        <Button className="w-full" formAction={loginMethod === 'password' ? login : loginWithMagicLink}>
          {loginMethod === 'password' ? 'Einloggen' : 'Magic Link senden'}
        </Button>
      ) : (
        <Button className="w-full" formAction={signup}>
          Registrieren
        </Button>
      )}
    </form>
  )
}

