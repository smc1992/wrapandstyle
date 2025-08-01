import Image from 'next/image';
import { CheckCircle, Users, BookOpen, Calendar } from 'lucide-react';

const features = [
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'Experten-Netzwerk',
    description: 'Zugang zu über 500 geprüften Folierern in ganz Deutschland.',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    title: 'Exklusives Fachwissen',
    description: 'Aktuelle News, detaillierte Anleitungen und fundierte Materialtests.',
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: 'Community & Events',
    description: 'Regelmäßige Treffen, Workshops und direkter Austausch mit Profis.',
  },
];

export function AboutSection() {
  return (
    <section id="ueber-uns" className="py-16 sm:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-96 md:h-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/about-us-magazine.jpg"
              alt="WRAPS Magazin Cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Über unser Portal</h2>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Was als Printmagazin begann, hat sich zu Deutschlands führender Plattform für Fahrzeugfolierung entwickelt. Seit 2018 bieten wir Inspiration, Fachwissen und Vernetzung für alle, die ihr Fahrzeug individualisieren möchten.
            </p>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Unser Portal verbindet Endkunden mit den besten Folierungsexperten Deutschlands und bietet gleichzeitig fundierte Informationen zu Trends, Techniken und Materialien.
            </p>
            <div className="mt-8 space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}