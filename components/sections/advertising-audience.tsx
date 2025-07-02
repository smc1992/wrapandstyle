import AudienceChart from './audience-chart';

const AdvertisingAudience = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-primary font-medium mb-2">WEN SIE ERREICHEN</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Unsere Zielgruppe im Detail</h2>
            <p className="text-gray-600 mb-6">Wir verbinden Sie mit einer hoch engagierten und kaufkräftigen Community aus der gesamten DACH-Region. Unsere Nutzer sind die Entscheider und Meinungsführer der Folierungsbranche.</p>
            <ul className="space-y-3">
              <li className="flex items-start"><i className="ri-user-star-line text-primary mr-3 mt-1"></i><span><strong>42% Professionelle Folierer:</strong> Kernzielgruppe mit hohem Bedarf an Produkten und Dienstleistungen.</span></li>
              <li className="flex items-start"><i className="ri-tools-line text-primary mr-3 mt-1"></i><span><strong>28% DIY-Enthusiasten:</strong> Ambitionierte Hobby-Anwender und zukünftige Profis.</span></li>
              <li className="flex items-start"><i className="ri-car-line text-primary mr-3 mt-1"></i><span><strong>18% Fahrzeugbesitzer:</strong> Endkunden auf der Suche nach qualifizierten Betrieben.</span></li>
              <li className="flex items-start"><i className="ri-building-4-line text-primary mr-3 mt-1"></i><span><strong>12% Händler & Hersteller:</strong> B2B-Entscheider und Partner der Branche.</span></li>
            </ul>
          </div>
          <div>
            <AudienceChart />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisingAudience;
