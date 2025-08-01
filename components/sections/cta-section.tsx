import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CtaSection() {
  return (
    <section className="py-20 bg-secondary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Bereit für den nächsten Schritt?</h2>
        <p className="text-lg mb-10 max-w-xl mx-auto">
          Egal ob Sie einen zuverlässigen Folierer suchen oder als Betrieb neue Kunden gewinnen möchten – hier sind Sie richtig.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Link href="/register">Partner werden</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="border border-white bg-transparent text-white hover:bg-white hover:text-secondary w-full sm:w-auto">
            <Link href="/folierer">Projekt starten</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
