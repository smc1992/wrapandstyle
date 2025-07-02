import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Anfrage bestätigt',
  description: 'Vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten.',
  robots: { // Prevents search engines from indexing this confirmation page
    index: false,
    follow: false,
  }
};

export default function AnfrageBestaetigungPage() {
  return (
    <section className="pt-32 pb-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-green-600 text-4xl"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Vielen Dank!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Ihre Anfrage wurde erfolgreich an uns übermittelt. Wir werden uns so schnell wie möglich bei Ihnen melden.
          </p>
          <Link href="/" className="inline-block bg-primary text-black px-8 py-3 rounded-md font-semibold hover:bg-opacity-80 transition-all">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </section>
  );
}
