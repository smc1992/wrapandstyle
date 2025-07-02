import Link from 'next/link';

const benefits = [
    {
        icon: 'ri-focus-2-line',
        title: 'Zielgruppengenau',
        description: 'Erreichen Sie genau die Zielgruppe, die sich für Fahrzeugfolierung und Fahrzeugindividualisierung interessiert.'
    },
    {
        icon: 'ri-eye-2-line',
        title: 'Hohe Sichtbarkeit',
        description: 'Platzieren Sie Ihre Werbung an strategisch wichtigen Positionen mit hoher Aufmerksamkeit.'
    },
    {
        icon: 'ri-ruler-2-line',
        title: 'Messbare Ergebnisse',
        description: 'Erhalten Sie detaillierte Auswertungen zu Impressionen, Klicks und Conversion-Raten.'
    },
    {
        icon: 'ri-shake-hands-line',
        title: 'Flexible Formate',
        description: 'Wählen Sie aus verschiedenen Bannergrößen und Platzierungsmöglichkeiten.'
    }
];

const serviceFeatures = [
    { icon: 'ri-user-heart-line', text: 'Persönliche Beratung' },
    { icon: 'ri-bar-chart-2-line', text: 'Regelmäßige Reports zu Performance' },
    { icon: 'ri-refresh-line', text: 'Flexible Anpassungen' },
];

const AdvertisingBenefitsAndService = () => {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Left Side: Benefits */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Ihre Vorteile auf einen Blick</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            {benefits.map(item => (
                                <div key={item.title}>
                                    <div className="flex items-center mb-3">
                                        <div className="bg-primary/10 p-3 rounded-full mr-4">
                                            <i className={`${item.icon} text-primary text-2xl`}></i>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600 pl-16">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Service Card */}
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mt-10 lg:mt-0">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Unser Service für Sie</h3>
                        <ul className="space-y-3 mb-6">
                            {serviceFeatures.map(feature => (
                                <li key={feature.text} className="flex items-center">
                                    <i className={`${feature.icon} text-primary text-xl`}></i>
                                    <span className="ml-3 text-gray-700">{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                        <Link href="/kontakt" className="block w-full text-center bg-primary hover:bg-primary/90 text-white py-3 px-4 !rounded-button font-medium transition-colors">
                            Jetzt anfragen
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdvertisingBenefitsAndService;
