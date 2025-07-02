'use client';

import { useRef } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Marco Schmidt',
    company: 'Schmidt Folientechnik',
    quote: 'Seit wir auf wrap-style.de werben, hat sich die Anzahl qualifizierter Anfragen verdreifacht. Die beste Investition in unser Marketing seit langem!',
    image: 'https://readdy.ai/api/search-image?query=Portrait%2520of%2520a%2520confident%2520male%2520owner%2520of%2520a%2520car%2520wrapping%2520business.%2520He%2520is%2520standing%2520in%2520his%2520workshop%252C%2520smiling.%2520Professional%252C%2520trustworthy%2520and%2520friendly.&width=100&height=100&seq=102',
  },
  {
    name: 'Julia Becker',
    company: 'Creative Wraps GmbH',
    quote: 'Die Zusammenarbeit mit dem WRAPS Magazin für unser Advertorial war extrem professionell. Das Ergebnis hat unsere Erwartungen übertroffen und uns neue B2B-Kontakte gebracht.',
    image: 'https://readdy.ai/api/search-image?query=Portrait%2520of%2520a%2520successful%2520female%2520marketing%2520manager%2520of%2520a%2520creative%2520car%2520wrapping%2520company.%2520Modern%2520office%2520in%2520the%2520background.&width=100&height=100&seq=103',
  },
  {
    name: 'Thomas Klein',
    company: 'Folien-Großhandel Klein',
    quote: 'Durch die Bannerwerbung konnten wir die Bekanntheit unserer neuen Produktlinie signifikant steigern. Die Zielgruppe ist einfach perfekt.',
    image: 'https://readdy.ai/api/search-image?query=Portrait%2520of%2520a%2520male%2520CEO%2520of%2520a%2520vinyl%2520wrap%2520wholesale%2520business.%2520He%2520looks%2520experienced%2520and%2520reliable.&width=100&height=100&seq=104',
  },
  {
    name: 'Carina Huber',
    company: 'Huber Design & Folie',
    quote: 'Als kleinerer Betrieb war ich anfangs skeptisch, aber die Listung im Folierer-Verzeichnis bringt mir konstant neue Kunden aus meiner Region. Absolut empfehlenswert!',
    image: 'https://readdy.ai/api/search-image?query=Portrait%2520of%2520a%2520young%2520female%2520entrepreneur%2520who%2520owns%2520a%2520small%2520car%2520wrapping%2520design%2520studio.%2520Creative%2520and%2520modern.&width=100&height=100&seq=105',
  },
];

const TestimonialSlider = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      <div ref={sliderRef} className="flex overflow-x-auto space-x-6 pb-8 snap-x snap-mandatory scrollbar-hide">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="flex-shrink-0 w-[90%] md:w-[45%] lg:w-[30%] snap-center bg-white p-8 rounded-xl shadow-lg border">
            <div className="flex items-center mb-4">
              <Image src={testimonial.image} alt={testimonial.name} width={64} height={64} className="w-16 h-16 rounded-full mr-4 object-cover" />
              <div>
                <p className="font-bold text-lg">{testimonial.name}</p>
                <p className="text-sm text-primary">{testimonial.company}</p>
              </div>
            </div>
            <p className="text-gray-600 italic">“{testimonial.quote}”</p>
          </div>
        ))}
      </div>
      <button onClick={() => scroll('left')} id="prev-testimonial" className="absolute top-1/2 -translate-y-1/2 -left-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 z-10">
        <i className="ri-arrow-left-s-line text-2xl"></i>
      </button>
      <button onClick={() => scroll('right')} id="next-testimonial" className="absolute top-1/2 -translate-y-1/2 -right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 z-10">
        <i className="ri-arrow-right-s-line text-2xl"></i>
      </button>
    </div>
  );
};

export default TestimonialSlider;
