import { Check, Target, Newspaper, Award } from 'lucide-react';

const features = {
  enthusiasts: [
    'Ausführliche Schritt-für-Schritt Anleitungen',
    'Materialkunde und Werkzeugempfehlungen',
    'Direkte Verbindung zu Herstellern und Händlern',
    'Community-Support und Expertentipps',
  ],
  professionals: [
    'Qualifizierte Kundenanfragen',
    'Exklusive Brancheneinblicke',
    'Professionelles Netzwerk',
    'Marketing und Präsenz',
  ],
};

const benefits = [
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: 'Qualifizierte Leads',
    description: 'Erreichen Sie Kunden, die gezielt nach professionellen Folierungsdienstleistungen suchen.',
  },
  {
    icon: <Newspaper className="h-8 w-8 text-primary" />,
    title: 'Mediale Präsenz',
    description: 'Profitieren Sie von der Reichweite des WRAPS Magazins und unserem starken Online-Auftritt.',
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: 'Expertise & Networking',
    description: 'Werden Sie Teil eines exklusiven Netzwerks und profitieren Sie von unserem Branchen-Know-how.',
  },
];

export const PlatformSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-primary font-semibold uppercase tracking-wider">Für Profis & Enthusiasten</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Die zentrale Plattform für Fahrzeugfolierung</h2>
          <p className="mt-4 text-lg text-gray-600">
            Ob Profi oder Enthusiast - als führendes Branchenportal und Herausgeber des WRAPS Magazins bieten wir Ihnen alles rund um das Thema Fahrzeugfolierung.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Für DIY-Enthusiasten</h3>
            <ul className="mt-6 space-y-4">
              {features.enthusiasts.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0 mr-3 mt-1" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Für Profis</h3>
            <ul className="mt-6 space-y-4">
              {features.professionals.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-6 w-6 text-green-500 flex-shrink-0 mr-3 mt-1" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center">
              <div className="flex justify-center items-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-6">
                {benefit.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900">{benefit.title}</h4>
              <p className="mt-2 text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
