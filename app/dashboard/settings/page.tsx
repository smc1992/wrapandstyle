"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateUserPassword, updateUserEmail } from './actions';
import { toast } from 'sonner';
import { useEffect } from 'react';

const initialState: { 
  success: boolean; 
  error: string | null; 
  message: string | null; 
} = {
  success: false,
  error: null,
  message: null,
};

function PasswordSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Speichern...' : 'Neues Passwort speichern'}
    </Button>
  );
}

function EmailSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Speichern...' : 'Neue E-Mail speichern'}
    </Button>
  );
}

export default function SettingsPage() {
    const [passwordState, passwordFormAction] = useActionState(updateUserPassword, initialState);
    const [emailState, emailFormAction] = useActionState(updateUserEmail, initialState);

      useEffect(() => {
    if (passwordState.success && passwordState.message) {
      toast.success(passwordState.message);
    } else if (!passwordState.success && passwordState.error) {
      toast.error(passwordState.error);
    }
  }, [passwordState]);

      useEffect(() => {
    if (emailState.success && emailState.message) {
      toast.success(emailState.message);
    } else if (!emailState.success && emailState.error) {
      toast.error(emailState.error);
    }
  }, [emailState]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Einstellungen</h1>
        <p className="text-muted-foreground">Verwalten Sie hier Ihre Kontoeinstellungen.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Passwort ändern</CardTitle>
          <CardDescription>Geben Sie hier Ihr neues Passwort ein. Wenn Sie sich per Magic Link registriert haben, können Sie hier Ihr Passwort für zukünftige Logins festlegen. Aus Sicherheitsgründen werden Sie nach der Änderung abgemeldet.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={passwordFormAction} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="password">Neues Passwort</Label>
              <Input id="password" name="password" type="password" required minLength={8} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirm">Passwort bestätigen</Label>
              <Input id="password_confirm" name="password_confirm" type="password" required minLength={8} />
            </div>
            <PasswordSubmitButton />
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>E-Mail-Adresse ändern</CardTitle>
          <CardDescription>Geben Sie hier Ihre neue E-Mail-Adresse ein. Sie erhalten eine Bestätigungs-E-Mail, um die Änderung abzuschließen.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={emailFormAction} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="email">Neue E-Mail-Adresse</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <EmailSubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
