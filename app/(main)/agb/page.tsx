import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Allgemeine Geschäftsbedingungen',
  description: 'Lesen Sie die Allgemeinen Geschäftsbedingungen der WNP Medien GmbH.',
};

export default function AGBPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">Allgemeine Geschäftsbedingungen</h1>
      <div className="w-full max-w-5xl mx-auto" style={{ height: '85vh' }}>
        <iframe
          src="/documents/agb.pdf#view=fitH"
          width="100%"
          height="100%"
          title="Allgemeine Geschäftsbedingungen"
          style={{ border: 'none' }}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
