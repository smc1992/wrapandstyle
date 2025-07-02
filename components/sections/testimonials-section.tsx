"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from 'lucide-react';

const testimonials = [
  {
    quote: 'Seit wir auf der Plattform sind, haben sich unsere Anfragen verdreifacht. Die Qualität der Kunden ist hervorragend.',
    name: 'Markus Klein',
    title: 'Klein Folientechnik',
    avatar: '',
  },
  {
    quote: "Endlich eine zentrale Anlaufstelle für alles rund um Fahrzeugfolierung! Die Community ist großartig und die bereitgestellten Informationen sind Gold wert.",
    name: "Erika Mustermann",
    title: "WrapStyle Deluxe",
    avatar: "https://i.pravatar.cc/150?u=erika",
  },
  {
    quote: "Ich war anfangs skeptisch, aber die Ergebnisse sprechen für sich. Die Sichtbarkeit meines Betriebs hat sich enorm verbessert. Sehr empfehlenswert!",
    name: "Klaus Kleber",
    title: "CarSkin Solutions",
    avatar: "https://i.pravatar.cc/150?u=klaus",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary">Das sagen unsere Partner</h2>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Echte Meinungen von echten Profis. Lesen Sie, wie unser Portal den Arbeitsalltag erleichtert und neue Kunden bringt.
          </p>
        </div>

        <div className="relative w-full max-w-5xl mx-auto">
          <button
            onClick={() => scroll('left')}
            className="absolute left-[-20px] md:left-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Vorheriges Testimonial"
          >
            <ArrowLeft className="h-6 w-6 text-primary" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -ml-4"
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 snap-start pl-4">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center text-center p-8 flex-grow">
                      <div className="relative w-20 h-20 mb-6">
                        {testimonial.avatar ? (
                          <Image
                            src={testimonial.avatar}
                            alt={`Avatar von ${testimonial.name}`}
                            fill
                            className="rounded-full border-2 border-primary p-1 object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full border-2 border-primary p-1 flex items-center justify-center">
                            <i className="ri-user-line text-4xl text-gray-400"></i>
                          </div>
                        )}
                      </div>
                      <p className="italic text-gray-700 mb-6 text-base leading-relaxed flex-grow">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <h3 className="font-bold text-xl text-secondary">{testimonial.name}</h3>
                      <p className="text-sm text-gray-500">{testimonial.title}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-[-20px] md:right-[-50px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Nächstes Testimonial"
          >
            <ArrowRight className="h-6 w-6 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
}
