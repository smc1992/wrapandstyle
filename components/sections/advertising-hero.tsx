import Link from 'next/link';

const AdvertisingHero = () => {
  const heroStyle = {
    backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.2) 100%), url('https://readdy.ai/api/search-image?query=Professional%2520banner%2520advertising%2520on%2520a%2520car%2520wrapping%2520website%252C%2520showing%2520high-quality%2520digital%2520marketing%2520for%2520automotive%2520industry.%2520The%2520image%2520displays%2520a%2520sleek%2520website%2520interface%2520with%2520banner%2520ads%2520for%2520car%2520wrapping%2520services%252C%2520vehicle%2520vinyl%2520wrap%2520products%252C%2520and%2520automotive%2520customization.%2520Clean%252C%2520modern%2520web%2520design%2520with%2520strategic%2520ad%2520placement%2520that%2520attracts%2520attention%2520without%2520being%2520intrusive.&width=1920&height=600&seq=101&orientation=landscape')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section style={heroStyle} className="text-white py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <span className="inline-block bg-primary/20 text-primary font-semibold py-1 px-3 rounded-full mb-4">Werbung auf wrapandstyle.de</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Maximale Reichweite in der Folierungs-Branche</h1>
          <p className="text-xl text-gray-300 mb-8">Präsentieren Sie Ihre Marke auf Deutschlands führendem Portal für Fahrzeugfolierung und erreichen Sie tausende Profis und Enthusiasten.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="#formats" className="group bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-button font-medium whitespace-nowrap flex items-center">
              Werbeformate entdecken
              <i className="ri-arrow-down-line ml-2 transition-transform group-hover:translate-y-1"></i>
            </Link>
            <Link href="#kontakt" className="group border-2 border-white text-white hover:bg-white hover:text-secondary py-3 px-6 rounded-button font-medium whitespace-nowrap flex items-center transition-colors">
              Direkt anfragen
              <i className="ri-mail-send-line ml-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisingHero;
