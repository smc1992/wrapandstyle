"use client";

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PortfolioImage {
  id: string;
  image_url: string;
  title: string | null;
}

interface PublicPortfolioGalleryProps {
  images: PortfolioImage[];
}

export function PublicPortfolioGallery({ images }: PublicPortfolioGalleryProps) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const lightboxSlides = images.map(image => ({ src: image.image_url, title: image.title || '' }));

  if (!images || images.length === 0) {
    return <p className="text-muted-foreground">Keine Portfolio-Bilder vorhanden.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative group aspect-square border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <Image
              src={image.image_url}
              alt={image.title || 'Portfolio Bild'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105 cursor-pointer"
              onClick={() => openLightbox(index)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            {image.title && (
              <div className="absolute bottom-0 left-0 p-3">
                <h3 className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">{image.title}</h3>
              </div>
            )}
          </div>
        ))}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={lightboxSlides}
        index={currentIndex}
      />
    </>
  );
}
