"use client";

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { deletePortfolioImage } from '@/app/dashboard/folierer/portfolio/actions';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export interface PortfolioImage {
  id: string;
  user_id: string;
  image_url: string;
  storage_path: string;
  title: string | null;
  created_at: string;
}

interface PortfolioGalleryProps {
  initialImages: PortfolioImage[];
}

export function PortfolioGallery({ initialImages }: PortfolioGalleryProps) {
  const [images, setImages] = useState<PortfolioImage[]>(initialImages);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setImages(initialImages);
  }, [initialImages]);

  const handleDelete = async (imageId: string, storagePath: string) => {
    startDeleteTransition(async () => {
      toast.loading('Bild wird gelöscht...', { id: `delete-${imageId}` });
      const result = await deletePortfolioImage(imageId, storagePath);
      if (result.success) {
        toast.success('Bild erfolgreich gelöscht!', { id: `delete-${imageId}` });
        setImages(currentImages => currentImages.filter(img => img.id !== imageId));
      } else {
        toast.error(`Fehler beim Löschen: ${result.error}`, { id: `delete-${imageId}` });
      }
    });
  };

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const lightboxSlides = images.map(image => ({ src: image.image_url, title: image.title || '' }));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Meine Portfolio Bilder</CardTitle>
          {images.length === 0 && <CardDescription>Sie haben noch keine Bilder hochgeladen.</CardDescription>}
        </CardHeader>
        <CardContent>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={image.id} className="relative group aspect-square border rounded-md overflow-hidden">
                  <Image
                    src={image.image_url}
                    alt={image.title || 'Portfolio Bild'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform group-hover:scale-105 cursor-pointer"
                    onClick={() => openLightbox(index)}
                  />
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                      onClick={() => handleDelete(image.id, image.storage_path)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Keine Bilder in Ihrer Galerie vorhanden.</p>
          )}
        </CardContent>
      </Card>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={lightboxSlides}
        index={currentIndex}
      />
    </>
  );
}
