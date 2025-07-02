'use client'

import Image from 'next/image';

interface PortfolioImage {
  id: string;
  image_url: string;
}

interface PortfolioGalleryProps {
  images: PortfolioImage[];
}

export default function PortfolioGallery({ images }: PortfolioGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Dieser Folierer hat noch keine Portfoliobilder hochgeladen.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <Image
            src={image.image_url}
            alt="Portfolio Bild"
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
