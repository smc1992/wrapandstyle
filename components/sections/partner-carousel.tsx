import React from 'react';
import Image from 'next/image';

// A static list of logos. This can be loaded dynamically later.
const logos = [
  { src: '/images/weiser.jpg.webp', alt: 'Weiser' },
  { src: '/images/RZ_folierungen-scaled.jpg', alt: 'RZ Folierungen' },
  { src: '/images/rz_activ_folientechnik_14052020_hh-3.jpg.webp', alt: 'Activ Folientechnik' },
  { src: '/images/moser.jpg.webp', alt: 'Moser' },
  { src: '/images/mb-design-bittner.jpg', alt: 'MB Design Bittner' },
  { src: '/images/baier-1-20240129-152132.jpg', alt: 'Baier' },
  { src: '/images/fostla.jpg.webp', alt: 'Fostla' },
  { src: '/images/ap-druckservice.jpg.webp', alt: 'AP Druckservice' },
];

const PartnerCarousel = () => {
  // Duplicate the logos to create a seamless infinite loop
  const extendedLogos = [...logos, ...logos];

  return (
    <div className="w-full py-16 bg-background overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter text-center">Unsere Partner</h2>
        <p className="text-lg text-muted-foreground text-center mt-4 mb-12">Starke Marken, die auf uns vertrauen.</p>
        <div
          className="relative w-full max-w-6xl mx-auto"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <div className="flex animate-scroll">
            {extendedLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 mx-10 flex items-center justify-center" style={{ width: '200px' }}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={60}
                  className="object-contain h-24 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCarousel;
