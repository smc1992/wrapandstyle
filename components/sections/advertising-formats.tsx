import Link from 'next/link';

const formats = [
  {
    title: 'Leaderboard Banner',
    size: '728 x 90 px (Desktop) / 320 x 100 px (Mobil)',
    description: 'Prominente Platzierung im Header-Bereich auf allen Seiten. Maximale Sichtbarkeit für Ihre Marke.',
    features: ['Hohe Klickrate', 'Ideal für Branding', 'Exklusive Platzierung möglich'],
    price: 'ab 450€',
    period: '/ Monat',
    popular: false,
  },
  {
    title: 'Medium Rectangle',
    size: '300 x 250 px',
    description: 'Effektive Platzierung in der Sidebar oder im Content-Bereich. Perfekt für gezielte Produktwerbung.',
    features: ['Vielseitig einsetzbar', 'Hohe Engagement-Rate', 'Auch als Video-Ad buchbar'],
    price: 'ab 300€',
    period: '/ Monat',
    popular: true,
  },
  {
    title: 'Advertorial / Sponsored Post',
    size: 'Individueller Artikel',
    description: 'Erzählen Sie Ihre Markengeschichte in einem redaktionellen Umfeld. Nachhaltiger Content-Marketing-Ansatz.',
    features: ['Maximales Storytelling', 'SEO-Vorteile', 'Teilbar in Social Media'],
    price: 'ab 850€',
    period: '/ einmalig',
    popular: false,
  },
];

const AdvertisingFormats = () => {
  return (
    <section id="formate" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-medium mb-2">FLEXIBEL & EFFEKTIV</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Unsere Werbeformate</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Wählen Sie das passende Format für Ihre Kampagne. Alle Formate sind für Desktop und Mobilgeräte optimiert.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formats.map((format) => (
            <div key={format.title} className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1 ${format.popular ? 'border-2 border-primary' : ''}`}>
              <div className={`relative ${format.popular ? '' : 'p-6 bg-gray-50 border-b'}`}>
                {format.popular && <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">BELIEBT</span>}
                <div className={`${format.popular ? 'p-6 bg-primary/10 border-b border-primary/20' : ''}`}>
                  <h3 className={`text-xl font-bold ${format.popular ? 'text-primary' : ''}`}>{format.title}</h3>
                  <p className={`${format.popular ? 'text-primary/80' : 'text-gray-500'}`}>{format.size}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{format.description}</p>
                <ul className="space-y-2 text-gray-700">
                  {format.features.map((feature) => (
                    <li key={feature} className="flex items-center"><i className="ri-check-line text-primary mr-2"></i>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className={`p-6 ${format.popular ? 'bg-primary/10' : 'bg-gray-50'}`}>
                <div className={`text-3xl font-bold mb-2 ${format.popular ? 'text-primary' : ''}`}>{format.price} <span className={`text-lg font-normal ${format.popular ? 'text-primary/80' : 'text-gray-500'}`}>{format.period}</span></div>
                <Link href="#kontakt" className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-2 px-4 !rounded-button font-medium">Jetzt anfragen</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvertisingFormats;
