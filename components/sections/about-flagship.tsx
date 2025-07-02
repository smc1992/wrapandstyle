'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, BarChart, Globe, ArrowRight } from 'lucide-react';

const features = [
  { title: 'Tiefgehende Technik-Guides', description: 'Von der richtigen Rakeltechnik bis zur Analyse neuer Folienmaterialien – wir liefern das Know-how, das Profis weiterbringt.', icon: BookOpen },
  { title: 'Exklusive Showcases', description: 'Wir präsentieren die atemberaubendsten Folierungsprojekte aus aller Welt in detaillierten Case Studies und Hochglanz-Fotostrecken.', icon: BarChart },
  { title: 'Markt- und Trend-Reports', description: 'Mit Berichten von den wichtigsten Messen wie der SEMA Show und FESPA bleiben unsere Leser immer am Puls der Zeit.', icon: Globe },
];

export const AboutFlagship = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-primary dark:text-cyan-400 font-semibold uppercase tracking-wider mb-2">Unser Flaggschiff</h3>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Das WRAPS Magazin</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Seit der ersten Sonderausgabe 2009 und dem Start als regelmäßiges Magazin 2010 ist WRAPS die führende Stimme der Car-Wrapping-Branche im deutschsprachigen Raum. Wir haben die Entwicklung von einer Nische zu einem etablierten Handwerk begleitet und mitgestaltet. Seit 2015 erreichen wir unsere Leser auch digital – als E-Paper und über unsere App.
            </p>
            <ul className="space-y-6 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-primary/10 text-primary dark:bg-cyan-400/10 dark:text-cyan-400 p-3 rounded-full mr-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{feature.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-4">
              <Link href="/abonnieren" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors">
                Magazin abonnieren <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/digitale-ausgaben" className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors">
                Digitale Ausgaben
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
                        <div className="relative aspect-[3/4] rounded-lg shadow-2xl transform rotate-[-3deg] hover:rotate-0 hover:scale-105 transition-transform duration-300">
              <Image src="/images/wraps/wnp-wraps-magazin-cover-01.jpg" alt="WRAPS Magazin Cover 1" fill className="object-cover rounded-lg" />
            </div>
            <div className="relative aspect-[3/4] rounded-lg shadow-2xl transform rotate-[2deg] hover:rotate-0 hover:scale-105 transition-transform duration-300 mt-8">
              <Image src="/images/wraps/wnp-wraps-magazin-cover-02.jpg" alt="WRAPS Magazin Cover 2" fill className="object-cover rounded-lg" />
            </div>
            <div className="relative aspect-[3/4] rounded-lg shadow-2xl transform rotate-[4deg] hover:rotate-0 hover:scale-105 transition-transform duration-300">
              <Image src="/images/wraps/wnp-wraps-magazin-cover-03.jpg" alt="WRAPS Magazin Cover 3" fill className="object-cover rounded-lg" />
            </div>
            <div className="relative aspect-[3/4] rounded-lg shadow-2xl transform rotate-[-1deg] hover:rotate-0 hover:scale-105 transition-transform duration-300 mt-8">
              <Image src="/images/wraps/wnp-wraps-magazin-cover-04.jpg" alt="WRAPS Magazin Cover 4" fill className="object-cover rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
