'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';

const timelineData = [
  { year: '1992', title: 'WERBETECHNIK', description: 'Die erste Ausgabe des Fachmagazins WERBETECHNIK erscheint im April 1992.' },
  { year: '1995', title: 'DIGITALDRUCK', description: 'Die erste Ausgabe des Fachmagazins DIGITALDRUCK erscheint im September 1995.' },
  { year: '2007', title: 'GRÜNDUNG WNP VERLAG', description: 'Gründung der WNP-Verlags GmbH durch Wolfgang Plonner und Nicole Steiger.' },
  { year: '2008', title: 'UMZUG', description: 'Umzug in die ersten Büroräume in Hohenschäftlarn.' },
  { year: '2009', title: 'WRAPS', description: 'Pünktlich zur Viscom 2009 erschien erstmals WRAPS – Das Sonderheft zum Thema Vollverklebung.' },
  { year: '2010', title: 'TEXPRINT & AD|HOC', description: 'Die Spezialausgabe zum Thema Textildruck, Sticken und Transfer - TEXPRINT erscheint einmalig zur FESPA 2010.' },
  { year: '2010', title: 'SIP', description: 'Ab Juli 2010 erscheint SIP – Das Fachmagazin für Siebdruck & Digitaldruck im WNP Verlag.' },
  { year: '2010', title: 'WWW.SIP-ONLINE.DE', description: 'Im Oktober 2010 geht das Portal für Sieb- und Digitaldrucker www.sip-online.de ins Netz.' },
  { year: '2011', title: 'WWW.WRAPS-ONLINE.DE', description: 'www.WRAPS-online.de geht im Oktober 2011 an den Start – das Portal für Vollverklebung.' },
  { year: '2012', title: 'WETEC FACHMESSE', description: 'Im Februar 2012 fand erstmalig die WETEC als Fachmesse für Werbetechnik, Digitaldruck und Lichtwerbung in Stuttgart statt.' },
  { year: '2013', title: 'NEUES FIRMENGEBÄUDE', description: 'Im April 2013 bezieht die WNP Gruppe das neue Firmengebäude in Hohenschäftlarn vor den Toren Münchens.' },
  { year: '2014', title: 'GIVEADAYS FACHMESSE', description: 'Im Jahr 2014 wird die WETEC erweitert durch das Thema Digital Signage und die GiveADays, die internationale Fachmesse für Werbeartikel.' },
  { year: '2015', title: 'E-PAPER UND APP', description: 'Seit 2015 sind alle im WNP Verlag erscheinenden Fachmagazine auch als E-Paper für die Leser erhältlich.' },
  { year: '2016', title: 'MEDIENPARTNER DES ZVW', description: 'Im Oktober 2016 wird das Fachmagazin WERBETECHNIK offizieller Medienpartner des ZVW – Zentralverband Werbetechnik.' },
  { year: '2018', title: 'WETEC / GIVEADAYS', description: 'Die Fachmessen WETEC und GiveADays werden im Oktober 2018 an die Landesmesse Stuttgart verkauft.' },
  { year: '2019', title: 'WWW.WERBETECHNIK.DE', description: 'Im Mai 2019 geht die neue werbetechnik.de an den Start. Der Newsbereich wurde ausgebaut und das CMS mit Social Media Kanälen verknüpft.' },
  { year: '2020', title: 'WWW.WNP.DE', description: 'Es wurde Zeit auch die Verlagswebsite zu erneuern. Im Februar 2020 war es dann soweit. Übersichtlich und informativ sollte sie sein.' },
  { year: '2021', title: 'KNHA VERLAGSGRUPPE ÜBERNIMMT WNP VERLAG', description: 'Im Zuge einer geordneten Nachfolgeregelung hat die KNHA Verlagsgruppe im Juli 2021 den WNP Verlag übernommen.' },
  { year: '2022', title: '30-JÄHRIGES VERLAGS-JUBILÄUM', description: '2022 feiern wir unser 30-jähriges Verlags-Jubiläum. Die erste Ausgabe der WERBETECHNIK erschien im April 1992.' },
  { year: '2023', title: 'WNP VERLAG BEKOMMT NEUE VERLAGSLEITERIN', description: 'Nach 32 Jahren wird sich Wolfgang Plonner aus dem Verlagsgeschäft zurückziehen. Die Verlagsleitung wird Sandra Johnson ab Januar 2024 übernehmen.' },
  { year: '2024', title: 'NEUE RÄUMLICHKEITEN UND UMFIRMRIERUNG', description: 'Im September 2024 zieht der WNP Verlag nach Geretsried ins Gewerbegebiet Gelting. Der Sitz der Gesellschaft ist Stuttgart, die Geschäftsadresse ist Geretsried.' }
];

const AnimatedTimelineItem = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLLIElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <li
      ref={ref}
      className={`space-y-12 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </li>
  );
};

export const AboutHistory = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Unsere Geschichte</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Von den Anfängen bis heute – ein Weg voller Meilensteine.</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          <ol className="relative">
            {timelineData.map((item, index) => (
              <AnimatedTimelineItem key={index}>
                <div className="relative flex items-center mb-8">
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-10 text-right' : 'pl-10 text-left'}`}>
                    {index % 2 === 0 && (
                      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-primary dark:text-cyan-400">{item.year}</h3>
                        <h4 className="text-lg font-semibold mt-2 text-gray-800 dark:text-gray-200">{item.title}</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-1/2 z-10 transform -translate-x-1/2">
                    <div className="bg-primary w-6 h-6 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className={`w-1/2 ${index % 2 !== 0 ? 'pl-10 text-left' : 'pr-10 text-right'}`}>
                     {index % 2 !== 0 && (
                       <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-primary dark:text-cyan-400">{item.year}</h3>
                        <h4 className="text-lg font-semibold mt-2 text-gray-800 dark:text-gray-200">{item.title}</h4>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedTimelineItem>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
