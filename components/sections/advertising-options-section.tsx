import Link from 'next/link';

const options = [
  {
    icon: 'ri-advertisement-line',
    title: 'Banner-Werbung',
    description: 'Platzieren Sie Ihre Werbebanner an strategisch wichtigen Stellen auf unserer Plattform und erreichen Sie Ihre Zielgruppe.',
    link: '/werbung/banner',
  },
  {
    icon: 'ri-newspaper-line',
    title: 'Sponsored Content',
    description: 'Veröffentlichen Sie Fachartikel und Produktvorstellungen in unserem Magazinbereich und positionieren Sie sich als Experte.',
    link: '/werbung/sponsored-content',
  },
  {
    icon: 'ri-vip-crown-line',
    title: 'Premium Partnerschaften',
    description: 'Profitieren Sie von exklusiven Marketingmöglichkeiten und direktem Zugang zu unserer qualifizierten Zielgruppe.',
    link: '/werbung/premium-partnerschaften',
  },
];

export function AdvertisingOptionsSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Maßgeschneiderte Werbemöglichkeiten</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Erreichen Sie potenzielle Kunden und Partner mit unseren maßgeschneiderten Werbemöglichkeiten. Wählen Sie die Option, die am besten zu Ihren Zielen passt.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((option, index) => (
            <div key={index} className="bg-white dark:bg-background rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <i className={`${option.icon} text-primary text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">{option.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{option.description}</p>
              <Link href={option.link} className="inline-flex items-center text-primary hover:text-primary/80">
                <span className="font-medium">Mehr erfahren</span>
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="#" className="inline-flex items-center bg-primary hover:bg-primary/90 text-white py-3 px-6 !rounded-button font-medium whitespace-nowrap">
            <span>Werbepaket anfragen</span>
            <i className="ri-arrow-right-line ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
