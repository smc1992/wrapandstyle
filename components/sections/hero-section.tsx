import Image from 'next/image';
import Link from 'next/link';

// TODO: Lade das wraps-magazine-icon.png/jpg herunter und speichere es unter public/images/
// const wrapsMagazineIcon = "/images/wraps-magazine-icon.png"; // Beispielpfad

export function HeroSection() {
  return (
    <section 
      className="min-h-screen flex items-center relative overflow-hidden text-white bg-cover bg-center bg-[url('/images/hero-background.jpg')]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
      <div className="container mx-auto px-4 w-full relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center bg-primary/20 backdrop-blur-sm pl-3 pr-4 py-2 rounded-full mb-6">
            <i className="ri-newspaper-line text-2xl mr-2"></i>
            <span className="text-sm font-medium">Vom Team des WRAPS Magazins</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ihr Erfolg ist unsere <span className="text-primary">Mission</span>
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Vernetzen Sie sich mit qualifizierten Kunden, präsentieren Sie Ihre Arbeit und profitieren Sie von 10 Jahren Branchenexpertise.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#folierer-finden" className="group bg-primary hover:bg-primary/90 text-white py-3 px-6 !rounded-button font-medium whitespace-nowrap flex items-center">
              Jetzt Folierer werden
              <i className="ri-arrow-right-line ml-2 transition-transform group-hover:translate-x-1"></i>
            </Link>
            <Link href="#eintragen" className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-3 px-6 !rounded-button font-medium whitespace-nowrap flex items-center">
              Mehr erfahren
              <i className="ri-arrow-right-line ml-2 transition-transform group-hover:translate-x-1"></i>
            </Link>
          </div>
          <div className="flex items-center mt-12 space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold">10+</div>
              <div className="text-sm opacity-80">Jahre Expertise</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50k+</div>
              <div className="text-sm opacity-80">Monatliche Leser</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">100+</div>
              <div className="text-sm opacity-80">Aktive Folierer</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
