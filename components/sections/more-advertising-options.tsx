import Link from 'next/link';

const options = [
  {
    icon: 'ri-article-line',
    title: 'Sponsored Posts',
    description: 'Veröffentlichen Sie hochwertige Fachartikel und positionieren Sie sich als Experte in der Branche.',
    link: '/werbung/sponsored-content', 
    linkText: 'Mehr erfahren',
  },
  {
    icon: 'ri-vip-crown-2-line',
    title: 'Premium Partnerschaften',
    description: 'Profitieren Sie von exklusiven Marketingmöglichkeiten und direktem Zugang zu unserer qualifizierten Zielgruppe.',
    link: '/werbung/premium-partnerschaften', 
    linkText: 'Mehr erfahren',
  },
  {
    icon: 'ri-mail-send-line',
    title: 'Newsletter Werbung',
    description: 'Platzieren Sie Ihre Werbebotschaft in unserem monatlichen Newsletter und erreichen Sie über 15.000 Abonnenten.',
    link: '#kontakt', 
    linkText: 'Jetzt anfragen',
  },
];

const MoreAdvertisingOptions = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Weitere Werbemöglichkeiten</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Entdecken Sie unsere weiteren maßgeschneiderten Werbemöglichkeiten für Ihr Unternehmen.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {options.map((option) => (
            <div key={option.title} className="bg-white dark:bg-background rounded-xl shadow-lg p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="flex justify-center items-center mb-4">
                <i className={`${option.icon} text-4xl text-primary`}></i>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{option.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{option.description}</p>
              <Link href={option.link} className="font-medium text-primary hover:text-primary/80 transition-colors">
                {option.linkText} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoreAdvertisingOptions;
