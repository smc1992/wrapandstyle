"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateLogoUrl } from '@/app/dashboard/folierer/portfolio/actions';
import { toast } from 'sonner';

interface LogoUploaderProps {
  userId: string;
  initialLogoUrl: string | null;
}

export function LogoUploader({ userId, initialLogoUrl }: LogoUploaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setLogoUrl(initialLogoUrl);
  }, [initialLogoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setLogoUrl(previewUrl); // Show preview
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    toast.loading('Logo wird hochgeladen...', { id: 'logo-upload-toast' });

        // Create a safe filename for Supabase Storage
    const fileExt = file.name.split('.').pop();
    const randomName = Math.random().toString(36).substring(2);
    const filePath = `${userId}/${randomName}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(`Upload-Fehler: ${uploadError.message}`, { id: 'logo-upload-toast' });
      setUploading(false);
      // Revert preview if needed or keep it and let user try again
      // setLogoUrl(initialLogoUrl); 
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    if (!publicUrl) {
        toast.error('Fehler: Konnte keine öffentliche URL für das Logo abrufen.', { id: 'logo-upload-toast' });
        setUploading(false);
        return;
    }

    const result = await updateLogoUrl(publicUrl);

    if (result?.error) {
      toast.error(`DB-Fehler: ${result.error}`, { id: 'logo-upload-toast' });
    } else {
      toast.success('Logo erfolgreich aktualisiert!', { id: 'logo-upload-toast' });
      setLogoUrl(publicUrl); // Update UI with the new persisted URL
      router.refresh(); // Refresh the current route to fetch new server-side props
    }

    setUploading(false);
    setFile(null); // Reset file input after upload
  };

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-medium">Firmenlogo</h3>
        <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-24 h-24 relative bg-muted rounded-md flex items-center justify-center">
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt="Firmenlogo"
                        fill
                        style={{ objectFit: 'contain' }}
                        className="rounded-md"
                    />
                ) : (
                    <span className="text-xs text-muted-foreground">Kein Logo</span>
                )}
            </div>
            <div className="flex-grow">
                <Input id="logo-upload" type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
                <Button onClick={handleUpload} disabled={uploading || !file}>
                    {uploading ? 'Wird hochgeladen...' : 'Logo hochladen'}
                </Button>
            </div>
        </div>
    </div>
  );
}
