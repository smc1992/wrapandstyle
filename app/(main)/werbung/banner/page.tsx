import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Banner-Werbung | WNP Magazin',
  description: 'Erreichen Sie Ihre Zielgruppe mit strategisch platzierten Werbebannern auf unserer Plattform.',
};

const benefits = [
  {
    icon: 'ri-target-line',
    title: 'Präzise Zielgruppe',
    description: 'Erreichen Sie Fachleute aus der Folierungs- und Werbetechnik-Branche ohne Streuverluste.',
  },
  {
    icon: 'ri-computer-line',
    title: 'Hohe Sichtbarkeit',
    description: 'Profitieren Sie von prominenten Platzierungen im Header, in der Sidebar oder direkt in unseren Artikeln.',
  },
  {
    icon: 'ri-bar-chart-box-line',
    title: 'Messbarer Erfolg',
    description: 'Detaillierte Reportings und Analysen geben Ihnen vollen Einblick in die Performance Ihrer Kampagne.',
  },
  {
    icon: 'ri-building-4-line',
    title: 'Markenbekanntheit steigern',
    description: 'Stärken Sie die Präsenz und das Ansehen Ihrer Marke in einem professionellen und relevanten Umfeld.',
  },
];

export default function BannerPage() {
  return (
    <>
      

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Ihre Vorteile auf einen Blick</h2>
            <p className="text-gray-600 mt-2">Warum Banner-Werbung im WNP Magazin die richtige Wahl ist.</p>
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
          <h2 className="text-3xl font-bold mb-4">Bereit, Ihre Sichtbarkeit zu erhöhen?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Kontaktieren Sie uns für ein individuelles Angebot und lassen Sie uns gemeinsam die perfekte Banner-Kampagne für Sie konzipieren.
          </p>
          <Link href="/kontakt" className="inline-flex items-center bg-primary hover:bg-primary/90 text-white py-3 px-8 !rounded-button font-medium whitespace-nowrap transition-colors">
            <span>Jetzt anfragen</span>
            <i className="ri-arrow-right-line ml-2"></i>
          </Link>
        </div>
      </section>
    </>
  );
}
