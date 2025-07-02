const benefits = [
  {
    icon: 'ri-group-2-line',
    title: 'Gezielte Zielgruppe',
    description: 'Erreichen Sie punktgenau professionelle Folierer, Werkstätten, Händler und kaufkräftige Endkunden mit starkem Interesse an Fahrzeugveredelung.',
  },
  {
    icon: 'ri-verified-badge-line',
    title: 'Hohe Glaubwürdigkeit',
    description: 'Als etabliertes Fachmagazin und führendes Branchenportal genießen wir höchstes Vertrauen bei unserer Leserschaft und unseren Nutzern.',
  },
  {
    icon: 'ri-line-chart-line',
    title: 'Messbare Erfolge',
    description: 'Wir bieten transparente Reportings und Analysen, damit Sie den Erfolg Ihrer Kampagnen jederzeit nachvollziehen und optimieren können.',
  },
];

const AdvertisingBenefits = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-medium mb-2">WARUM BEI UNS WERBEN?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ihre Vorteile auf einen Blick</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Profitieren Sie von unserer einzigartigen Positionierung im Markt und unserer engagierten Community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-1">
              <div className="inline-block bg-primary/10 text-primary p-4 rounded-full mb-4">
                <i className={`${benefit.icon} text-4xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvertisingBenefits;
