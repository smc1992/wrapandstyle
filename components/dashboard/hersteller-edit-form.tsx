'use client'

import { useEffect, useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateHerstellerProfile } from '@/app/dashboard/hersteller/actions'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast"

// Type for the profile data passed as props
interface HerstellerProfile {
  logo_url: string | null;
  firma: string | null;
  ansprechpartner: string | null;
  webseite: string | null;
  company_description: string | null;
  street: string | null;
  house_number: string | null;
  zip_code: string | null;
  city: string | null;
  phone_number: string | null;
  product_categories: string[] | null;
  video_url: string | null;
  mission_statement: string | null;
  vision_statement: string | null;
  company_history: string | null;
}

interface HerstellerEditFormProps {
  userId: string;
  profile: HerstellerProfile;
}

const initialState = {
  success: false,
  message: '',
  errors: null,
} as { success: boolean; message: string; errors: Record<string, string[]> | null }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Speichern...' : 'Änderungen speichern'}
    </Button>
  )
}

export function HerstellerEditForm({ profile, userId }: HerstellerEditFormProps) {
  const [state, formAction] = useActionState(updateHerstellerProfile.bind(null, userId), initialState)
  const { toast } = useToast()
  const [logoPreview, setLogoPreview] = useState<string | null>(profile.logo_url);

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
            <Input id="phone_number" name="phone_number" type="tel" defaultValue={profile.phone_number ?? ''} placeholder="0123 456789" />
            {state?.errors?.phone_number && <p className="text-sm text-red-500 mt-1">{state.errors.phone_number.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="webseite">Webseite</Label>
            <Input id="webseite" name="webseite" type="url" defaultValue={profile.webseite ?? ''} placeholder="https://beispiel.de" />
            {state?.errors?.webseite && <p className="text-sm text-red-500 mt-1">{state.errors.webseite.join(', ')}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Straße</Label>
              <Input id="street" name="street" defaultValue={profile.street ?? ''} placeholder="Musterstraße" />
              {state?.errors?.street && <p className="text-sm text-red-500 mt-1">{state.errors.street.join(', ')}</p>}
            </div>
            <div>
              <Label htmlFor="house_number">Hausnummer</Label>
              <Input id="house_number" name="house_number" defaultValue={profile.house_number ?? ''} placeholder="1a" />
              {state?.errors?.house_number && <p className="text-sm text-red-500 mt-1">{state.errors.house_number.join(', ')}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="md:col-span-1">
              <Label htmlFor="zip_code">PLZ</Label>
              <Input id="zip_code" name="zip_code" defaultValue={profile.zip_code ?? ''} placeholder="12345" />
              {state?.errors?.zip_code && <p className="text-sm text-red-500 mt-1">{state.errors.zip_code.join(', ')}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="city">Stadt</Label>
              <Input id="city" name="city" defaultValue={profile.city ?? ''} placeholder="Musterstadt" />
              {state?.errors?.city && <p className="text-sm text-red-500 mt-1">{state.errors.city.join(', ')}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profil-Details</CardTitle>
          <CardDescription>Beschreiben Sie Ihr Unternehmen.</CardDescription>
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
            <Label htmlFor="product_categories">Produktkategorien</Label>
            <Input 
              id="product_categories" 
              name="product_categories" 
              defaultValue={profile.product_categories?.join(', ') ?? ''} 
              placeholder="z.B. Lackschutzfolien, Scheibentönung, Zubehör"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Geben Sie Ihre Hauptproduktkategorien getrennt durch Kommas ein.
            </p>
            {state?.errors?.product_categories && <p className="text-sm text-red-500 mt-1">{state.errors.product_categories.join(', ')}</p>}
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
          <CardTitle>Firmenlogo</CardTitle>
          <CardDescription>Laden Sie hier Ihr Firmenlogo hoch. Es wird auf Ihrer öffentlichen Profilseite angezeigt.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoPreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Aktuelles Logo:</p>
              <Image src={logoPreview} alt="Logo Vorschau" width={96} height={96} className="h-24 w-24 object-cover rounded-md border p-2" />
            </div>
          )}
          <div>
            <Label htmlFor="logo">Neues Logo hochladen</Label>
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
                  setLogoPreview(profile.logo_url);
                }
              }}
            />
            {state?.errors?.logo && <p className="text-sm text-red-500 mt-1">{state.errors.logo.join(', ')}</p>}
            <p className="text-sm text-muted-foreground mt-1">
              Max. 5MB. Empfohlene Formate: PNG, JPG, WEBP.
            </p>
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
