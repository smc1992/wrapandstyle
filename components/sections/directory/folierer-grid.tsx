import React from 'react';
import { FoliererCard, Folierer } from './folierer-card';
import { Button } from '@/components/ui/button';

// Mock data for initial implementation
const mockFolierer: Folierer[] = [
  {
    id: '1',
    logo: 'https://readdy.ai/api/search-image?query=A%20modern%2C%20professional%20logo%20for%20a%20car%20wrapping%20company.%20The%20logo%20is%20simple%2C%20clean%20and%20memorable%20with%20automotive%20design%20elements.%20Suitable%20for%20a%20vehicle%20wrapping%20business%20with%20a%20premium%20feel.%20The%20logo%20should%20work%20well%20on%20business%20cards%20and%20signage.&width=80&height=80&seq=6&orientation=squarish',
    name: 'CarWrap Experts GmbH',
    rating: 4.5,
    reviews: 48,
    description: 'Spezialisiert auf Premium-Fahrzeuge und Farbwechselfolien mit über 15 Jahren Erfahrung.',
    tags: ['Vollfolierung', 'Farbwechsel', 'Premium'],
    location: 'München, 80331',
    phone: '089 12345678',
    profileUrl: '#',
  },
  {
    id: '2',
    logo: 'https://readdy.ai/api/search-image?query=A%20modern%2C%20professional%20logo%20for%20a%20vehicle%20wrapping%20business.%20The%20logo%20has%20a%20sleek%2C%20automotive%20feel%20with%20dynamic%20elements%20suggesting%20movement%20and%20transformation.%20Clean%20design%20suitable%20for%20a%20premium%20car%20wrapping%20service.%20The%20logo%20should%20be%20simple%20enough%20to%20work%20well%20on%20business%20cards%20and%20vehicle%20graphics.&width=80&height=80&seq=7&orientation=squarish',
    name: 'WrapMaster Berlin',
    rating: 5,
    reviews: 72,
    description: 'Zertifizierter 3M-Partner mit Fokus auf langlebige Folierungen und kreative Designs.',
    tags: ['Designfolierung', 'Schutzfolierung', '3M-zertifiziert'],
    location: 'Berlin, 10115',
    phone: '030 98765432',
    profileUrl: '#',
  },
  {
    id: '3',
    logo: 'https://readdy.ai/api/search-image?query=A%20modern%2C%20professional%20logo%20for%20a%20premium%20car%20wrapping%20service.%20The%20logo%20features%20clean%20lines%20and%20a%20sophisticated%20design%20that%20conveys%20quality%20and%20precision.%20Suitable%20for%20a%20high-end%20automotive%20customization%20business.%20The%20logo%20should%20be%20simple%20enough%20to%20work%20well%20across%20different%20applications.&width=80&height=80&seq=8&orientation=squarish',
    name: 'VinylPro Hamburg',
    rating: 4,
    reviews: 35,
    description: 'Spezialist für Motorradfolierung und kleine Fahrzeuge mit individuellem Design.',
    tags: ['Motorräder', 'Teilfolierung', 'Custom Design'],
    location: 'Hamburg, 20095',
    phone: '040 55667788',
    profileUrl: '#',
  },
  {
    id: '4',
    logo: 'https://readdy.ai/api/search-image?query=A%20modern%2C%20professional%20logo%20for%20a%20vehicle%20wrapping%20and%20customization%20shop.%20The%20logo%20has%20a%20clean%2C%20automotive-inspired%20design%20that%20suggests%20precision%20and%20quality.%20Suitable%20for%20a%20business%20specializing%20in%20car%20wraps%20and%20vehicle%20customization.%20The%20logo%20should%20be%20simple%20and%20effective%20across%20different%20applications.&width=80&height=80&seq=9&orientation=squarish',
    name: 'AutoFolie24',
    rating: 4.5,
    reviews: 53,
    description: 'Komplett-Service für Nutzfahrzeuge und Firmenflotten mit Beschriftung und Branding.',
    tags: ['Nutzfahrzeuge', 'Flottenfolierung', 'Beschriftung'],
    location: 'Köln, 50667',
    phone: '0221 44332211',
    profileUrl: '#',
  },
];

export function FoliererGrid() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockFolierer.map((folierer) => (
          <FoliererCard key={folierer.id} folierer={folierer} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white py-3 px-6 !rounded-button font-medium transition-colors whitespace-nowrap">
          Mehr Folierer anzeigen
        </Button>
      </div>
    </div>
  );
}
