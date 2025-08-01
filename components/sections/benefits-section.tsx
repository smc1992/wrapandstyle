import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PartnerCarousel from './partner-carousel';

const benefits = [
  {
    icon: "ri-search-line",
    title: "Einfache Anbietersuche",
    description: "Finden Sie schnell und unkompliziert den passenden Folierer in Ihrer Nähe.",
  },
  {
    icon: "ri-star-line",
    title: "Transparente Bewertungen",
    description: "Lesen Sie echte Kundenmeinungen und treffen Sie eine fundierte Entscheidung.",
  },
  {
    icon: "ri-book-open-line",
    title: "Umfassendes Wissen",
    description: "Profitieren Sie von unseren Guides, Tutorials und dem aktuellen Magazin.",
  },
];

const partners = [
  { name: "AP-Druckservice", logo: "/images/ap-druckservice.jpg.webp" },
  { name: "Baier", logo: "/images/baier-1-20240129-152132.jpg" },
  { name: "Fostla", logo: "/images/fostla.jpg.webp" },
  { name: "MB Design Bittner", logo: "/images/mb-design-bittner.jpg" },
  { name: "Moser", logo: "/images/moser.jpg.webp" },
  { name: "Activ Folientechnik", logo: "/images/rz_activ_folientechnik_14052020_hh-3.jpg.webp" },
  { name: "RZ Folierungen", logo: "/images/RZ_folierungen-scaled.jpg" },
  { name: "Weiser", logo: "/images/weiser.jpg.webp" },
];

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold dark:text-white">Ihre Vorteile auf einen Blick</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">Die zentrale Anlaufstelle für Fahrzeugfolierung in Deutschland.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardHeader>
                <i className={`${benefit.icon} mx-auto text-4xl text-primary`}></i>
                <CardTitle className="mt-4">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>


        
        <PartnerCarousel partners={partners} />

      </div>
    </section>
  );
}
