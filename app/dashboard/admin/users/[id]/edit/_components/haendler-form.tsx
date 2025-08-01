'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HaendlerFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function HaendlerForm({ formData, handleInputChange }: HaendlerFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Basic Data */}
      <div className="space-y-4">
        <h4 className="font-semibold">Basisdaten</h4>
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
            <Label htmlFor="company_description">Über uns (Firmenbeschreibung)</Label>
            <Textarea id="company_description" name="company_description" value={formData.company_description || ''} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  );
}
