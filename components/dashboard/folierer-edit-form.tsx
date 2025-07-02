'use client'

import { useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateFoliererProfile } from '@/app/dashboard/folierer/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label';
import React, { useState, useEffect as useReactEffect } from 'react'; // Renamed to avoid conflict if useActionState imports its own useEffect
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tag, TagInput } from 'emblor';
import { useToast } from "@/hooks/use-toast" // Shadcn toast

// Define a type for the profile data passed as props
// Define a type for the profile data passed as props, matching the new DB structure
interface FoliererProfile {
  firma: string | null;
  ansprechpartner: string | null;
  webseite: string | null;
  // New fields
  company_description: string | null;
  services: string[] | null; // This is an array in the DB
  address: string | null;
  phone_number: string | null;
  video_url: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  company_history: string | null;
  // Old fields that are now consolidated or renamed
  telefon: string | null; // Will be mapped to phone_number
  spezialisierungen: string | null; // Will be mapped to services
  strasse_hausnummer: string | null; // Will be part of address
  plz_ort: string | null; // Will be part of address
}

interface FoliererEditFormProps {
  userId: string;
  profile: FoliererProfile;
}

const initialState = {
  success: false,
  message: '',
  errors: null,
} as { success: boolean; message: string; errors: Record<string, string[]> | null } // Type assertion for initialState

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Speichern...' : 'Änderungen speichern'}
    </Button>
  )
}

export function FoliererEditForm({ profile, userId }: FoliererEditFormProps) {
  // Consolidate address from old fields if new one is empty
  const initialAddress = profile.address ?? [profile.strasse_hausnummer, profile.plz_ort].filter(Boolean).join(', ');
  const initialPhoneNumber = profile.phone_number ?? profile.telefon ?? '';
  
  // The `spezialisierungen` string from DB is now mapped to `services` array for the TagInput
  const initialServices = profile.services ?? (profile.spezialisierungen ? profile.spezialisierungen.split(',').map(s => s.trim()).filter(s => s) : []);

  const [servicesTags, setServicesTags] = useState<Tag[]>(initialServices.map(s => ({ id: s, text: s })));
  const [servicesString, setServicesString] = useState<string>(initialServices.join(','));
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  // Update hidden input string when tags array changes
  useReactEffect(() => {
    setServicesString(servicesTags.map(tag => tag.text).join(','));
  }, [servicesTags]);

  const [state, formAction] = useActionState(updateFoliererProfile.bind(null, userId), initialState)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({
          title: "Erfolg",
          description: state.message,
        })
      } else {
        toast({
          title: "Fehler",
          description: state.message || "Ein unbekannter Fehler ist aufgetreten.",
          variant: "destructive",
        })
      }
    }
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-8">
      {state?.success === false && state.message && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100" role="alert">
          <span className="font-medium">Bitte korrigieren Sie Ihre Eingabe:</span> {state.message}
        </div>
      )}

      {state?.success === true && state.message && (
        <div className="p-4 rounded-md bg-green-100 text-green-700">
          {state.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Allgemeine Informationen</CardTitle>
          <CardDescription>Grundlegende Angaben zu Ihrem Unternehmen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="firma">Firmenname</Label>
            <Input id="firma" name="firma" defaultValue={profile.firma ?? ''} placeholder="Beispiel GmbH" />
            {state?.errors?.firma && <p className="text-sm text-red-500 mt-1">{state.errors.firma.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="ansprechpartner">Ansprechpartner</Label>
            <Input id="ansprechpartner" name="ansprechpartner" defaultValue={profile.ansprechpartner ?? ''} placeholder="Max Mustermann" />
            {state?.errors?.ansprechpartner && <p className="text-sm text-red-500 mt-1">{state.errors.ansprechpartner.join(', ')}</p>}
          </div>
        </CardContent>
      </Card>

            <Card>
        <CardHeader>
          <CardTitle>Kontaktdaten & Adresse</CardTitle>
          <CardDescription>Wie und wo können Kunden Sie erreichen?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phone_number">Telefon</Label>
            <Input id="phone_number" name="phone_number" type="tel" defaultValue={initialPhoneNumber} placeholder="0123 456789" />
            {state?.errors?.phone_number && <p className="text-sm text-red-500 mt-1">{state.errors.phone_number.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="webseite">Webseite</Label>
            <Input id="webseite" name="webseite" type="url" defaultValue={profile.webseite ?? ''} placeholder="https://beispiel.de" />
            {state?.errors?.webseite && <p className="text-sm text-red-500 mt-1">{state.errors.webseite.join(', ')}</p>}
          </div>
           <div>
            <Label htmlFor="address">Vollständige Adresse</Label>
            <Input id="address" name="address" defaultValue={initialAddress} placeholder="Musterstraße 1, 12345 Musterstadt" />
            {state?.errors?.address && <p className="text-sm text-red-500 mt-1">{state.errors.address.join(', ')}</p>}
          </div>
        </CardContent>
      </Card>

            <Card>
        <CardHeader>
          <CardTitle>Profil-Details</CardTitle>
          <CardDescription>Beschreiben Sie Ihr Unternehmen und Ihre Dienstleistungen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company_description">Unternehmensbeschreibung</Label>
            <Textarea
              id="company_description"
              name="company_description"
              defaultValue={profile.company_description ?? ''}
              placeholder="Erzählen Sie uns etwas über Ihr Unternehmen, Ihre Geschichte und was Sie auszeichnet."
              className="resize-y min-h-[120px]"
            />
            {state?.errors?.company_description && <p className="text-sm text-red-500 mt-1">{state.errors.company_description.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="services-input">Dienstleistungen / Spezialisierungen</Label>
            <TagInput
              id="services-input"
              placeholder="Dienstleistung hinzufügen und Enter drücken..."
              tags={servicesTags}
              setTags={setServicesTags}
              activeTagIndex={activeTagIndex}
              setActiveTagIndex={setActiveTagIndex}
              className="sm:min-w-[450px]"
              inputProps={{ id: 'services-tag-input-field' }}
            />
            <input type="hidden" name="services" value={servicesString} />
            {state?.errors?.services && <p className="text-sm text-red-500 mt-1">{state.errors.services.join(', ')}</p>}
            <p className="text-sm text-muted-foreground mt-1">
              Nach jeder Eingabe Enter drücken, um eine Dienstleistung hinzuzufügen.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Über uns / Unternehmensphilosophie</CardTitle>
          <CardDescription>Teilen Sie Ihre Mission, Vision und Geschichte, um Kunden ein tieferes Verständnis für Ihr Unternehmen zu geben.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mission_statement">Unsere Mission</Label>
            <Textarea
              id="mission_statement"
              name="mission_statement"
              defaultValue={profile.mission_statement ?? ''}
              placeholder="Was ist der Hauptzweck Ihres Unternehmens? Welches Problem lösen Sie für Ihre Kunden?"
              className="resize-y min-h-[100px]"
            />
            {state?.errors?.mission_statement && <p className="text-sm text-red-500 mt-1">{state.errors.mission_statement.join(', ')}</p>}
          </div>
           <div>
            <Label htmlFor="vision_statement">Unsere Vision</Label>
            <Textarea
              id="vision_statement"
              name="vision_statement"
              defaultValue={profile.vision_statement ?? ''}
              placeholder="Wo sehen Sie Ihr Unternehmen in der Zukunft? Was sind Ihre langfristigen Ziele?"
              className="resize-y min-h-[100px]"
            />
            {state?.errors?.vision_statement && <p className="text-sm text-red-500 mt-1">{state.errors.vision_statement.join(', ')}</p>}
          </div>
           <div>
            <Label htmlFor="company_history">Unsere Geschichte / Meilensteine</Label>
            <Textarea
              id="company_history"
              name="company_history"
              defaultValue={profile.company_history ?? ''}
              placeholder="Erzählen Sie, wie alles begann. Wichtige Ereignisse, Erfolge oder die Entwicklung Ihres Unternehmens."
              className="resize-y min-h-[150px]"
            />
            {state?.errors?.company_history && <p className="text-sm text-red-500 mt-1">{state.errors.company_history.join(', ')}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing & Medien</CardTitle>
          <CardDescription>Präsentieren Sie Ihr Unternehmen mit einem Video.</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="video_url">Video-URL</Label>
            <Input id="video_url" name="video_url" type="url" defaultValue={profile.video_url ?? ''} placeholder="https://www.youtube.com/watch?v=..." />
            {state?.errors?.video_url && <p className="text-sm text-red-500 mt-1">{state.errors.video_url.join(', ')}</p>}
            <p className="text-sm text-muted-foreground mt-1">
              Fügen Sie hier den Link zu Ihrem Imagevideo ein (z.B. von YouTube oder Vimeo).
            </p>
          </div>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  )
}
