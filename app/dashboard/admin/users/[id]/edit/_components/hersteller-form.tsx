'use client';

import React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HerstellerFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function HerstellerForm({ formData, handleInputChange }: HerstellerFormProps) {
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
          <Input id="logo" name="logo" type="file" />
          <p className="text-xs text-muted-foreground">
            {formData.logo_url ? 'Neues Logo hochladen, um das aktuelle zu ersetzen.' : 'Logo hochladen.'}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="firma">Firma/Name</Label>
          <Input id="firma" name="firma" value={formData.firma || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Adresse (einzeilig)</Label>
          <Input id="address" name="address" value={formData.address || ''} onChange={handleInputChange} placeholder="Straße, Nr, PLZ, Ort"/>
          <p className="text-xs text-muted-foreground">Vollständige Adresse für Hersteller und Händler.</p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone_number">Telefon</Label>
          <Input id="phone_number" name="phone_number" value={formData.phone_number || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="webseite">Webseite</Label>
          <Input id="webseite" name="webseite" value={formData.webseite || ''} onChange={handleInputChange} />
        </div>
      </div>

      {/* Right Column: Role-Specific Data */}
      <div className="space-y-4">
        <h4 className="font-semibold">Rollenspezifische Daten</h4>
         <div className="grid gap-2">
          <Label htmlFor="ansprechpartner">Ansprechpartner</Label>
          <Input id="ansprechpartner" name="ansprechpartner" value={formData.ansprechpartner || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company_description">Über uns (Firmenbeschreibung)</Label>
          <Textarea id="company_description" name="company_description" value={formData.company_description || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="product_categories">Produktkategorien (Komma-getrennt)</Label>
          <Input id="product_categories" name="product_categories" value={formData.product_categories || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company_history">Firmengeschichte</Label>
          <Textarea id="company_history" name="company_history" value={formData.company_history || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mission_statement">Mission</Label>
          <Textarea id="mission_statement" name="mission_statement" value={formData.mission_statement || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vision_statement">Vision</Label>
          <Textarea id="vision_statement" name="vision_statement" value={formData.vision_statement || ''} onChange={handleInputChange} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="youtube_channel_url">YouTube Kanal URL</Label>
          <Input id="youtube_channel_url" name="youtube_channel_url" value={formData.youtube_channel_url || ''} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  );
}
