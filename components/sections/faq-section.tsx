'use client';

import { useState } from 'react';
import type { FC } from 'react';

// Define the type for a single FAQ item
interface Faq {
  question: string;
  answer: string;
}

// Define the type for the FaqItem component props
interface FaqItemProps {
  faq: Faq;
  isOpen: boolean;
  onClick: () => void;
}

const faqData: Faq[] = [
  {
    question: 'Wie lange dauert es, bis mein Banner online ist?',
    answer: 'Nach Eingang aller Unterlagen und Freigabe ist Ihr Banner in der Regel innerhalb von 2-3 Werktagen online.',
  },
  {
    question: 'Kann ich mein Banner während der Laufzeit austauschen?',
    answer: 'Ja, ein Austausch ist einmal pro Monat kostenlos möglich. Weitere Änderungen werden mit einer geringen Bearbeitungsgebühr berechnet.',
  },
  {
    question: 'Welche Zahlungsmethoden werden akzeptiert?',
    answer: 'Wir akzeptieren Überweisung, PayPal und Kreditkartenzahlung. Die Rechnung wird zu Beginn der Laufzeit gestellt.',
  },
  {
    question: 'Gibt es Einschränkungen bezüglich der Werbeinhalte?',
    answer: 'Ja, die Werbeinhalte müssen den gesetzlichen Bestimmungen entsprechen und thematisch zur Plattform passen. Detaillierte Informationen finden Sie in unseren AGB.',
  },
  {
    question: 'Welche Zielgruppe erreiche ich mit einer Banner-Werbung?',
    answer: 'Mit unserer Banner-Werbung erreichen Sie sowohl professionelle Folierer als auch Endkunden, die sich für Fahrzeugfolierung interessieren. Unsere Nutzer sind überwiegend männlich (78%), zwischen 25 und 45 Jahre alt und verfügen über ein überdurchschnittliches Einkommen. Sie sind technikaffin und legen Wert auf Qualität und Individualität.'
  },
  {
    question: 'Wie wird die Performance meiner Banner gemessen?',
    answer: 'Wir stellen Ihnen detaillierte Auswertungen zur Verfügung, die Impressionen, Klicks, CTR (Click-Through-Rate) und, falls gewünscht, auch Conversion-Tracking umfassen. Sie erhalten regelmäßige Reports und haben jederzeit Zugriff auf ein Dashboard mit Echtzeit-Daten.'
  }
];

const FaqItem: FC<FaqItemProps> = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-white focus:outline-none"
        onClick={onClick}
      >
        <span>{faq.question}</span>
        <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'transform rotate-45' : ''}`}>+</span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] mt-4' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
            <p className="text-gray-600 dark:text-gray-300">
              {faq.answer}
            </p>
        </div>
      </div>
    </div>
  );
};

const FaqSection: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Häufig gestellte Fragen</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Antworten auf die wichtigsten Fragen zu unseren Banner-Werbemöglichkeiten.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
