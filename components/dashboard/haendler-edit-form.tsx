'use client'

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateHaendlerProfile, State } from '@/app/dashboard/haendler/profileActions';
import { useToast } from '@/hooks/use-toast';
import { Brand, ProductCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { SubmitButton } from '@/components/ui/submit-button';
import Image from 'next/image';

interface HaendlerEditFormProps {
  profile: any; // Using 'any' as data structure from Supabase with joins is complex.
  allBrands: Brand[];
  allProductCategories: ProductCategory[];
}

export function HaendlerEditForm({ profile, allBrands, allProductCategories }: HaendlerEditFormProps) {
  const router = useRouter();
  const initialState: State = { success: false, message: null, errors: null };
  const [formState, formAction] = useActionState(updateHaendlerProfile, initialState);
  const { toast } = useToast();

  // --- State for Controlled Components ---
  const [selectedBrandIds, setSelectedBrandIds] = useState(new Set<number>());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(new Set<number>());
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.logo_url || null);

  // --- Effects ---

  // Effect 1: Synchronize state with server-provided props.
  // This runs when the component mounts and whenever the profile prop changes.
  useEffect(() => {
    // Explicitly type the IDs to resolve TypeScript errors from the 'any' prop type.
    const brandIds: number[] = profile.haendler_brands?.map((b: any) => Number(b.brands.id)) || [];
    const categoryIds: number[] = profile.haendler_product_categories?.map((c: any) => Number(c.product_categories.id)) || [];
    
    setSelectedBrandIds(new Set(brandIds));
    setSelectedCategoryIds(new Set(categoryIds));
    setPreviewUrl(profile.logo_url || null);
  }, [profile]);

  // Effect 2: Handle form submission feedback (toasts and refresh).
  useEffect(() => {
    if (formState.message) {
      toast({
        title: formState.success ? "Erfolg" : "Fehler",
        description: formState.message,
        variant: formState.success ? "success" : "destructive",
      });
      if (formState.success) {
        router.refresh();
      }
    }
  }, [formState, toast, router]);

  // --- Handlers for Controlled Checkboxes ---
  const handleBrandChange = (brandId: number, checked: boolean) => {
    setSelectedBrandIds(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(brandId); else newSet.delete(brandId);
      return newSet;
    });
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setSelectedCategoryIds(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(categoryId); else newSet.delete(categoryId);
      return newSet;
    });
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden inputs to submit the controlled state for form action */}
      {Array.from(selectedBrandIds).map(id => <input key={`brand_hidden_${id}`} type="hidden" name="brands" value={id} />)}
      {Array.from(selectedCategoryIds).map(id => <input key={`cat_hidden_${id}`} type="hidden" name="product_categories" value={id} />)}

      {/* Stammdaten Card */}
      <Card>
        <CardHeader>
          <CardTitle>Stammdaten</CardTitle>
          <CardDescription>Geben Sie hier die Basis-Informationen zu Ihrem Unternehmen ein.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firma">Firmenname <span className="text-red-500">*</span></Label>
            <Input id="firma" name="firma" defaultValue={profile.firma || ''} required />
            {formState.errors?.firma && <p className="text-red-500 text-sm mt-1">{formState.errors.firma.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="ansprechpartner">Ansprechpartner <span className="text-red-500">*</span></Label>
            <Input id="ansprechpartner" name="ansprechpartner" defaultValue={profile.ansprechpartner || ''} required />
            {formState.errors?.ansprechpartner && <p className="text-red-500 text-sm mt-1">{formState.errors.ansprechpartner.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="webseite">Webseite</Label>
            <Input id="webseite" name="webseite" type="url" defaultValue={profile.webseite || ''} placeholder="https://..." />
            <p className="text-sm text-gray-500 mt-1">Bitte geben Sie die volle URL an (z.B. https://ihre-webseite.de).</p>
            {formState.errors?.webseite && <p className="text-red-500 text-sm mt-1">{formState.errors.webseite.join(', ')}</p>}
          </div>
          <div>
            <Label htmlFor="phone_number">Telefonnummer</Label>
            <Input id="phone_number" name="phone_number" defaultValue={profile.phone_number || ''} />
            {formState.errors?.phone_number && <p className="text-red-500 text-sm mt-1">{formState.errors.phone_number.join(', ')}</p>}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" name="address" defaultValue={profile.address || ''} />
            {formState.errors?.address && <p className="text-red-500 text-sm mt-1">{formState.errors.address.join(', ')}</p>}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="company_description">Unternehmensbeschreibung</Label>
            <Textarea id="company_description" name="company_description" defaultValue={profile.company_description || ''} rows={5} />
            {formState.errors?.company_description && <p className="text-sm text-red-500 mt-1">{formState.errors.company_description.join(', ')}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Logo Card */}
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Laden Sie hier Ihr Firmenlogo hoch.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <Label htmlFor="logo">Logo-Datei</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPreviewUrl(URL.createObjectURL(file));
                } else {
                  setPreviewUrl(profile.logo_url || null);
                }
              }}
            />
            <p className="text-sm text-gray-500 mt-2">Erlaubte Formate: PNG, JPG, WEBP. Max. 3MB.</p>
            {formState.errors?.logo && <p className="text-red-500 text-sm mt-1">{formState.errors.logo.join(', ')}</p>}
          </div>
          <div className="flex justify-center items-center p-4 border border-dashed rounded-lg h-40">
            {previewUrl ? (
              <Image src={previewUrl} alt="Logo Vorschau" width={128} height={128} className="object-contain h-full" />
            ) : (
              <span className="text-gray-500">Logo Vorschau</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marken Card */}
      <Card>
        <CardHeader>
          <CardTitle>Marken</CardTitle>
          <CardDescription>Wählen Sie die Marken aus, die Sie führen.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allBrands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrandIds.has(brand.id)}
                onCheckedChange={(checked) => handleBrandChange(brand.id, !!checked)}
              />
              <Label htmlFor={`brand-${brand.id}`} className="font-normal">{brand.name}</Label>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Produktkategorien Card */}
      <Card>
        <CardHeader>
          <CardTitle>Produktkategorien</CardTitle>
          <CardDescription>Wählen Sie die passenden Produktkategorien aus.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProductCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategoryIds.has(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
              />
              <Label htmlFor={`category-${category.id}`} className="font-normal">{category.name}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end items-center space-x-4 pt-4">
        <SubmitButton>Profil speichern</SubmitButton>
      </div>
    </form>
  );
}
