import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Premium Partnerschaften | WNP Magazin',
  description: 'Profitieren Sie von exklusiven Marketingmöglichkeiten und direktem Zugang zu unserer qualifizierten Zielgruppe.',
};

const benefits = [
  {
    icon: 'ri-calendar-event-line',
    title: 'Ganzjährige Präsenz',
    description: 'Werden Sie zum festen Bestandteil unserer Plattform mit dauerhafter Sichtbarkeit.',
  },
  {
    icon: 'ri-compass-3-line',
    title: 'Strategische Partnerschaft',
    description: 'Wir arbeiten eng mit Ihnen zusammen, um Ihre Marketingziele zu erreichen.',
  },
  {
    icon: 'ri-star-line',
    title: 'Exklusive Vorteile',
    description: 'Profitieren Sie von Leistungen, die nur unseren Premium-Partnern zur Verfügung stehen.',
  },
  {
    icon: 'ri-shake-hands-line',
    title: 'Starke Community-Bindung',
    description: 'Bauen Sie eine tiefe und nachhaltige Beziehung zu unserer engagierten Community auf.',
  },
];

export default function PremiumPartnershipPage() {
  return (
    <>
      

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Mehr als nur Werbung</h2>
            <p className="text-gray-600 mt-2">Die exklusiven Vorteile einer Premium Partnerschaft.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className={`${benefit.icon} text-primary text-3xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für den nächsten Schritt?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Unsere Premium Partnerschaften sind limitiert. Sprechen Sie uns an, um die Möglichkeiten einer exklusiven Zusammenarbeit zu besprechen.
          </p>
          <Link href="/kontakt" className="inline-flex items-center bg-primary hover:bg-primary/90 text-white py-3 px-8 !rounded-button font-medium whitespace-nowrap transition-colors">
            <span>Partnerschaft anfragen</span>
            <i className="ri-arrow-right-line ml-2"></i>
          </Link>
        </div>
      </section>
    </>
  );
}
