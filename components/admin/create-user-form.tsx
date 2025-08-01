'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createUserByAdmin, CreateUserState } from '../../lib/admin-actions';

const initialState: CreateUserState = {
  message: null,
  errors: {},
};

export function CreateUserForm() {
    const [state, dispatch] = useActionState(createUserByAdmin, initialState);
  const [role, setRole] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const renderRoleSpecificFields = () => {
    // Common fields for all roles
    const commonFields = (
      <>
        <div className="grid gap-2">
          <Label htmlFor="firma">Firma</Label>
          <Input id="firma" name="firma" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ansprechpartner">Ansprechpartner</Label>
          <Input id="ansprechpartner" name="ansprechpartner" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone_number">Telefon</Label>
          <Input id="phone_number" name="phone_number" type="tel" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="webseite">Webseite</Label>
          <Input id="webseite" name="webseite" />
        </div>
      </>
    );

    switch (role) {
      case 'folierer':
        return (
          <>
            {commonFields}
            <div className="grid gap-2">
                <Label htmlFor="address">Vollständige Adresse</Label>
                <Input id="address" name="address" placeholder="Musterstraße 1, 12345 Musterstadt" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="services">Dienstleistungen (kommagetrennt)</Label>
              <Textarea id="services" name="services" placeholder="z.B. Vollfolierung, Scheibentönung, Lackschutz" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="portfolio_images">Portfolio-Bilder (Mehrfachauswahl möglich)</Label>
              <Input 
                id="portfolio_images" 
                name="portfolio_images" 
                type="file" 
                multiple
                accept="image/png, image/jpeg, image/webp"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_description">Firmenbeschreibung</Label>
              <Textarea id="company_description" name="company_description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input id="video_url" name="video_url" placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mission_statement">Mission Statement</Label>
              <Textarea id="mission_statement" name="mission_statement" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vision_statement">Vision Statement</Label>
              <Textarea id="vision_statement" name="vision_statement" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_history">Firmengeschichte</Label>
              <Textarea id="company_history" name="company_history" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="banner_url">Banner Bild</Label>
              <Input id="banner_url" name="banner_url" type="file" accept="image/png, image/jpeg, image/webp" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">Firmenlogo</Label>
              <Input 
                id="logo" 
                name="logo" 
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLogoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setLogoPreview(null);
                  }
                }}
              />
              {logoPreview && (
                <div className="mt-2">
                  <Image src={logoPreview} alt="Logo Vorschau" width={80} height={80} className="h-20 w-20 object-cover rounded-md border p-1" />
                </div>
              )}
            </div>
          </>
        );
      case 'haendler':
        return (
          <>
            {commonFields}
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" name="address" placeholder="Straße, PLZ, Ort" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_description">Firmenbeschreibung</Label>
              <Textarea id="company_description" name="company_description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brands">Marken (kommagetrennt)</Label>
              <Input id="brands" name="brands" placeholder="z.B. 3M, Avery Dennison" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product_categories">Produktkategorien (kommagetrennt)</Label>
              <Input id="product_categories" name="product_categories" placeholder="z.B. Farbfolien, Werkzeuge" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">Firmenlogo</Label>
              <Input 
                id="logo" 
                name="logo" 
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLogoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setLogoPreview(null);
                  }
                }}
              />
              {logoPreview && (
                <div className="mt-2">
                  <Image src={logoPreview} alt="Logo Vorschau" width={80} height={80} className="h-20 w-20 object-cover rounded-md border p-1" />
                </div>
              )}
            </div>
          </>
        );
      case 'superadmin':
        return null; // Superadmins need no extra fields
      case 'hersteller':
        return (
          <>
            {commonFields}
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" name="address" placeholder="Straße, PLZ, Ort" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_description">Firmenbeschreibung</Label>
              <Textarea id="company_description" name="company_description" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input id="video_url" name="video_url" placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mission_statement">Mission</Label>
              <Textarea id="mission_statement" name="mission_statement" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vision_statement">Vision</Label>
              <Textarea id="vision_statement" name="vision_statement" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company_history">Firmengeschichte</Label>
              <Textarea id="company_history" name="company_history" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logo">Firmenlogo</Label>
              <Input 
                id="logo" 
                name="logo" 
                type="file" 
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLogoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setLogoPreview(null);
                  }
                }}
              />
              {logoPreview && (
                <div className="mt-2">
                  <Image src={logoPreview} alt="Logo Vorschau" width={80} height={80} className="h-20 w-20 object-cover rounded-md border p-1" />
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
        <form action={dispatch} className="space-y-8">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
        {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
      </div>
       <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
        {state.errors?.password && <p className="text-sm text-red-500">{state.errors.password[0]}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Rolle</Label>
        <Select name="role" onValueChange={setRole} required>
          <SelectTrigger>
            <SelectValue placeholder="Rolle auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="folierer">Folierer</SelectItem>
            <SelectItem value="haendler">Händler</SelectItem>
            <SelectItem value="hersteller">Hersteller</SelectItem>
            <SelectItem value="superadmin">Superadmin</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.role && <p className="text-sm text-red-500">{state.errors.role[0]}</p>}
      </div>
      
      {renderRoleSpecificFields()}

      <Button type="submit">Benutzer erstellen</Button>
      
      {state.message && <p className="text-sm text-red-500">{state.message}</p>}
    </form>
  );
}
