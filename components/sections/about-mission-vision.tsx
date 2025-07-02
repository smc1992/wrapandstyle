'use client';

import { Flag, Eye, CheckCircle, Globe, Cpu, Leaf, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface InfoPoint {
  title: string;
  description: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

interface InfoData {
  title: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  description: string;
  points: InfoPoint[];
}

const missionData = {
  title: 'Unsere Mission',
  icon: Flag,
  description: 'Wir verbinden Fahrzeugbesitzer mit den besten Folierungsexperten Deutschlands und bieten gleichzeitig fundierte Informationen zu Trends, Techniken und Materialien. Unser Ziel ist es, die Qualitätsstandards in der Branche zu heben und Transparenz für Endkunden zu schaffen.',
  points: [
    { title: 'Qualität fördern', description: 'Wir setzen uns für höchste Qualitätsstandards in der Fahrzeugfolierung ein und fördern professionelle Arbeitsweisen.', icon: CheckCircle },
    { title: 'Wissen teilen', description: 'Durch fundierte Fachartikel, Tutorials und Expertentipps machen wir Branchenwissen zugänglich.', icon: CheckCircle },
    { title: 'Vernetzung schaffen', description: 'Wir bringen Kunden, Folierer und Hersteller zusammen und fördern den Austausch in der Community.', icon: CheckCircle },
  ]
};

const visionData = {
  title: 'Unsere Vision',
  icon: Eye,
  description: 'Wir streben danach, die Fahrzeugfolierung als hochwertige Alternative zur Lackierung zu etablieren und die Branche durch Innovation und Digitalisierung voranzubringen. Bis 2030 wollen wir das europaweit führende Portal für Fahrzeugindividualisierung werden.',
  points: [
    { title: 'Internationale Expansion', description: 'Wir planen, unser erfolgreiches Konzept auf weitere europäische Märkte auszuweiten.', icon: Globe },
    { title: 'Digitale Innovation', description: 'Durch neue Technologien wie AR-Visualisierung wollen wir das Kundenerlebnis revolutionieren.', icon: Cpu },
    { title: 'Nachhaltigkeit', description: 'Wir fördern umweltfreundliche Folierungslösungen und ressourcenschonende Praktiken in der Branche.', icon: Leaf },
  ]
};

const InfoCard = ({ data }: { data: InfoData }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-full">
    <div className="flex items-center mb-6">
      <div className="bg-primary/10 text-primary dark:bg-cyan-400/10 dark:text-cyan-400 p-3 rounded-full mr-4">
        <data.icon className="w-6 h-6" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{data.title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 mb-8">{data.description}</p>
    <ul className="space-y-6">
      {data.points.map((point: InfoPoint, index: number) => (
        <li key={index} className="flex items-start">
          <div className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 rounded-full p-1.5 mr-4 flex-shrink-0">
            <point.icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{point.title}</h4>
            <p className="text-gray-500 dark:text-gray-400">{point.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export const AboutMissionVision = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard data={missionData} />
          <InfoCard data={visionData} />
        </div>
      </div>
    </section>
  );
};
