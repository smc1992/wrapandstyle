import { DirectorySection } from '@/components/sections/directory-section';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Folierer Verzeichnis | WNP Magazin',
  description: 'Finden Sie zertifizierte Fachbetriebe für Fahrzeugfolierung in Ihrer Nähe. Qualität, Service und Handwerkskunst für Ihr Fahrzeug.',
};

// This page component will now correctly render the DirectorySection.
// The DirectorySection itself is an async component that fetches its own data.
export default function FoliererPage() {
  return (
    <>
      <DirectorySection />
    </> 
  );
}
