'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUser, type ActionState } from '@/app/dashboard/admin/users/actions';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';
import FoliererForm from './folierer-form';
import HaendlerForm from './haendler-form';
import HerstellerForm from './hersteller-form';

interface EditUserFormProps {
  user: any; // Bleibt 'any', da die Datenstruktur dynamisch von der DB kommt
}

// Definiere einen Typ für den Formularstatus
interface UserFormData {
  id: string;
  email: string;
  role: string;
  logo?: File | string;
  folierer?: { [key: string]: any };
  hersteller?: { [key: string]: any };
  haendler?: { [key: string]: any };
  [key: string]: any; // Index-Signatur für dynamische Keys
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const initialState: ActionState = { message: '', type: 'idle' };
  const [state, formAction] = useActionState(updateUser, initialState);
  
  // Initialize form state with the user data passed from the server component
  const [formData, setFormData] = useState<UserFormData>(user);

  useEffect(() => {
    if (state.type === 'success') {
      toast.success(state.message);
    } else if (state.type === 'error') {
      toast.error(state.message);
    }
  }, [state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    setFormData((prev: UserFormData) => {
      const newState = { ...prev };
      let currentLevel: any = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        currentLevel[key] = { ...(currentLevel[key] || {}) };
        currentLevel = currentLevel[key];
      }

      currentLevel[keys[keys.length - 1]] = value;
      return newState;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const keys = name.split('.'); // z.B. ['logo'] oder ['folierer', 'logo']

      setFormData((prev: UserFormData) => {
        const newState = { ...prev };
        // Für den einfachen Fall 'logo' direkt setzen
        if (keys.length === 1) {
            newState.logo = file;
        } 
        // Ansonsten im verschachtelten Objekt setzen
        else {
            let currentLevel: any = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                currentLevel[key] = { ...(currentLevel[key] || {}) };
                currentLevel = currentLevel[key];
            }
            currentLevel[keys[keys.length - 1]] = file;
        }
        return newState;
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, role: value }));
  };

  if (!formData) {
    return <p>Benutzerdaten werden geladen...</p>;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={formData.id} />
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" name="email" type="email" value={formData.email || ''} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Rolle</Label>
            <Select name="role" value={formData.role || ''} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Rolle auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="folierer">Folierer</SelectItem>
                <SelectItem value="hersteller">Hersteller</SelectItem>
                <SelectItem value="haendler">Händler</SelectItem>
                <SelectItem value="superadmin">Superadmin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Pass the correct part of the state to the sub-forms */}
        {formData.role === 'folierer' && <FoliererForm formData={formData.folierer || {}} handleInputChange={handleInputChange} handleFileChange={handleFileChange} />}
        {formData.role === 'hersteller' && <HerstellerForm formData={formData.hersteller || {}} handleInputChange={handleInputChange} />}
        {formData.role === 'haendler' && <HaendlerForm formData={formData.haendler || {}} handleInputChange={handleInputChange} />}
        
        <div className="flex justify-end gap-4">
            <Button type="submit">Änderungen speichern</Button>
        </div>
      </div>
    </form>
  );
}
