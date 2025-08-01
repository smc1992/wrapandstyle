'use client';

import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface FoliererFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FoliererForm({ formData, handleInputChange, handleFileChange }: FoliererFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Basic Data */}
      <div className="space-y-4">
        <h4 className="font-semibold">Basisdaten</h4>

        {/* Logo Upload and Preview */}
        <div className="grid gap-2">
          <Label htmlFor="logo">Firmenlogo</Label>
          {formData.logo_url && (
            <div className="my-2">
              <p className="text-sm text-muted-foreground">Aktuelles Logo:</p>
              <Image
                src={formData.logo_url}
                alt="Firmenlogo"
                width={150}
                height={150}
                className="rounded-md object-contain border"
              />
            </div>
          )}
          <Input id="logo" name="logo" type="file" onChange={handleFileChange} />
          <p className="text-xs text-muted-foreground">
            {formData.logo_url ? 'Neues Logo hochladen, um das aktuelle zu ersetzen.' : 'Logo hochladen.'}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company_name">Firma/Name</Label>
          <Input id="company_name" name="folierer.company_name" value={formData.company_name || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ansprechpartner">Ansprechpartner</Label>
          <Input id="ansprechpartner" name="folierer.ansprechpartner" value={formData.ansprechpartner || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Adresse (Straße, Hausnr, PLZ, Ort)</Label>
          <Input id="address" name="folierer.address" value={formData.address || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone_number">Telefon</Label>
          <Input id="phone_number" name="folierer.phone_number" value={formData.phone_number || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="website">Webseite</Label>
          <Input id="website" name="folierer.website" value={formData.website || ''} onChange={handleInputChange} />
        </div>
      </div>

      {/* Right Column: Role-Specific Data */}
      <div className="space-y-4">
        <h4 className="font-semibold">Rollenspezifische Daten</h4>
        <div className="grid gap-2">
          <Label htmlFor="company_description">Über uns</Label>
          <Textarea id="company_description" name="folierer.company_description" value={formData.company_description || ''} onChange={handleInputChange} placeholder="Beschreiben Sie hier Ihr Unternehmen..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="services">Dienstleistungen (Komma-getrennt)</Label>
          <Textarea id="services" name="folierer.services" value={formData.services || ''} onChange={handleInputChange} placeholder="Listen Sie hier Ihre Dienstleistungen auf..." />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="video_url">Video URL (z.B. YouTube, Vimeo)</Label>
          <Input id="video_url" name="folierer.video_url" value={formData.video_url || ''} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  );
}
