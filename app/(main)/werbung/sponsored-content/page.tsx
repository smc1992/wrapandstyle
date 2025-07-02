import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sponsored Content | WNP Magazin',
  description: 'Positionieren Sie sich als Experte mit Fachartikeln und Produktvorstellungen in unserem Magazin.',
};

const benefits = [
  {
    icon: 'ri-award-line',
    title: 'Expertenstatus aufbauen',
    description: 'Positionieren Sie sich als Vordenker und vertrauenswürdige Quelle in Ihrer Nische.',
  },
  {
    icon: 'ri-group-line',
    title: 'Leser-Interaktion',
    description: 'Erzeugen Sie echtes Interesse und Engagement durch hochwertige, informative Inhalte.',
  },
  {
    icon: 'ri-seo-line',
    title: 'Nachhaltiger SEO-Wert',
    description: 'Profitieren Sie von permanenten Inhalten und wertvollen Backlinks für Ihre Website.',
  },
  {
    icon: 'ri-edit-box-line',
    title: 'Redaktionelle Unterstützung',
    description: 'Unser Team hilft Ihnen, Ihre Inhalte perfekt auf unsere Zielgruppe zuzuschneiden.',
  },
];

export default function SponsoredContentPage() {
  return (
    <>
      

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Inhalte, die überzeugen</h2>
            <p className="text-gray-600 mt-2">Die Vorteile von redaktioneller Werbung im WNP Magazin.</p>
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
          <h2 className="text-3xl font-bold mb-4">Bereit, Ihre Geschichte zu erzählen?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            Lassen Sie uns gemeinsam Inhalte erstellen, die Ihre Zielgruppe fesseln und Ihre Marke stärken.
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
