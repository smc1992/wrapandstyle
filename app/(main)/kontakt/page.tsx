import { Metadata } from 'next';
import { ContactForm } from '@/components/forms/contact-form';


export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Haben Sie Fragen, Anregungen oder möchten Sie mit uns zusammenarbeiten? Wir freuen uns auf Ihre Nachricht.',
};

const contactDetails = [
  {
    icon: 'ri-map-pin-line',
    title: 'Adresse',
    lines: ['WNP Medien GmbH', 'Lauterbachstraße 25 b', 'D-82538 Geretsried'],
  },
  {
    icon: 'ri-phone-line',
    title: 'Telefon',
    lines: ['08171/38 636-0'],
    href: 'tel:+498171386360',
  },
  {
    icon: 'ri-mail-send-line',
    title: 'E-Mail',
    lines: ['info@wrapandstyle.de'],
    href: 'mailto:info@wrapandstyle.de',
  },
];

export default function KontaktPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kontaktieren Sie uns</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Haben Sie Fragen, Anregungen oder möchten Sie mit uns zusammenarbeiten? Wir freuen uns auf Ihre Nachricht.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Contact Details */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Wie können wir Ihnen helfen?</h2>
              <div className="space-y-8">
                {contactDetails.map((detail) => (
                  <div key={detail.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className={`${detail.icon} text-primary text-xl`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{detail.title}</h3>
                      {
                        detail.href ? (
                          <a href={detail.href} className="text-primary font-medium hover:underline">
                            {detail.lines[0]}
                          </a>
                        ) : (
                          <p className="text-gray-600">
                            {detail.lines.map((line, index) => (
                              <span key={index} className="block">{line}</span>
                            ))}
                          </p>
                        )
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold mb-6">Kontaktformular</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Besuchen Sie uns</h2>
                                        <div className="max-w-5xl mx-auto aspect-video h-[450px] rounded-xl overflow-hidden shadow-lg border">
            <iframe 
              src="https://maps.google.com/maps?q=WNP%20Medien%20GmbH&ll=47.8859239,11.4323904&z=17&output=embed&iwloc=A"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>
    </>
  );
}
