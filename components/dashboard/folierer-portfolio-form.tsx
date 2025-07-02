"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTransition, useState } from "react";
import { updateFoliererPortfolio } from "@/app/dashboard/folierer/portfolio/actions";
import { LogoUploader } from "./logo-uploader";
import { Separator } from "@/components/ui/separator";
import PortfolioImageUploader from "./portfolio-image-uploader";
import { PortfolioGallery } from "./portfolio-gallery";
import type { FoliererProfile, PortfolioImage } from '@/lib/types';

// 1. Define the form schema with Zod
// 1. Define the form schema with Zod, including new fields
const formSchema = z.object({
  youtube_channel_url: z.string().url({
    message: "Bitte geben Sie eine gültige URL ein."
  }).optional().or(z.literal('')),
  company_description: z.string().max(1000, "Die Beschreibung darf maximal 1000 Zeichen lang sein.").optional(),
  address: z.string().min(5, "Bitte geben Sie eine gültige Adresse ein.").optional(),
  phone_number: z.string().min(5, "Bitte geben Sie eine gültige Telefonnummer ein.").optional(),
  services: z.string().optional(), // Handled as a comma-separated string in the UI
});

// Define the props for the component
interface FoliererPortfolioFormProps {
  profile: FoliererProfile;
  initialImages: PortfolioImage[];
}

export function FoliererPortfolioForm({ profile, initialImages }: FoliererPortfolioFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtube_channel_url: profile.youtube_channel_url || "",
      company_description: profile.company_description || "",
      address: profile.address || "",
      phone_number: profile.phone_number || "",
      services: profile.services?.join(', ') || "",
    },
  });

    async function onSubmit(values: z.infer<typeof formSchema>) {
    setMessage(null);
    const formData = new FormData();
    
    // Append all form values to FormData
    formData.append('youtube_channel_url', values.youtube_channel_url || '');
    formData.append('company_description', values.company_description || '');
    formData.append('address', values.address || '');
    formData.append('phone_number', values.phone_number || '');
    formData.append('services', values.services || ''); // Sent as a comma-separated string

    startTransition(async () => {
        const result = await updateFoliererPortfolio(formData);
        if (result?.message) {
          setMessage(result.message);
        }
        if (result?.errors) {
          // Handle potential validation errors from the server
          // For now, we log them. A more advanced implementation could set form errors.
          console.error("Server-side validation errors:", result.errors);
        }
    });
  }

  return (
    <div className="space-y-8">
      <LogoUploader userId={profile.user_id} initialLogoUrl={profile.logo_url} />
      <Separator />
      {/* The uploader now just handles uploading, revalidation is done by the action */}
      <PortfolioImageUploader />
      <Separator />
      <PortfolioGallery initialImages={initialImages} />
      <Separator />
            <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Description */}
          <FormField
            control={form.control}
            name="company_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unternehmensbeschreibung</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Erzählen Sie uns etwas über Ihr Unternehmen, Ihre Geschichte und was Sie auszeichnet."
                    className="resize-y min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Eine ansprechende Beschreibung hilft Kunden, Sie besser kennenzulernen.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Musterstraße 1, 12345 Musterstadt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefonnummer</FormLabel>
                <FormControl>
                  <Input placeholder="0123 456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Services */}
          <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dienstleistungen</FormLabel>
                <FormControl>
                  <Input placeholder="Vollfolierung, Scheibentönung, Lackschutz, ..." {...field} />
                </FormControl>
                <FormDescription>
                  Listen Sie Ihre Hauptdienstleistungen auf, getrennt durch Kommas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* YouTube Channel URL */}
          <FormField
            control={form.control}
            name="youtube_channel_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube Kanal URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.youtube.com/channel/ihr-kanal" {...field} />
                </FormControl>
                <FormDescription>
                  Fügen Sie den Link zu Ihrem YouTube-Kanal hinzu.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Profil wird gespeichert..." : "Profil speichern"}
            </Button>
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
          </div>
        </form>
      </Form>
    </div>
  );
}
