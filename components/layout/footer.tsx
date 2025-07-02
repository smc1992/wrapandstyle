import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo and About */}
          <div>
            <Image src="/images/Logo-wrapandstyle weiß-blau.webp" alt="Wrap&Style Logo" width={180} height={48} className="mb-4" />
            <p className="text-gray-400 mb-6 text-sm">
              Das führende Portal und Magazin für Fahrzeugfolierung in Deutschland. Seit über 10 Jahren Ihr verlässlicher Partner in der Folierungsbranche.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/wnp.verlag/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="https://www.youtube.com/@wnpverlag5057" aria-label="YouTube" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <i className="ri-youtube-line"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Schnellzugriff</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Startseite</Link></li>
              <li><Link href="/ueber-uns" className="text-gray-400 hover:text-white transition-colors">Über uns</Link></li>
              <li><Link href="/magazin" className="text-gray-400 hover:text-white transition-colors">Magazin</Link></li>
              <li><Link href="/folierer-finden" className="text-gray-400 hover:text-white transition-colors">Folierer finden</Link></li>
              <li><Link href="/eintragen" className="text-gray-400 hover:text-white transition-colors">Als Folierer eintragen</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Rechtliches</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/impressum" className="text-gray-400 hover:text-white transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="text-gray-400 hover:text-white transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="text-gray-400 hover:text-white transition-colors">AGB</Link></li>
              <li><button className="text-gray-400 hover:text-white transition-colors text-left">Cookie-Einstellungen</button></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">Bleiben Sie auf dem Laufenden mit den neuesten Trends und Tipps zur Fahrzeugfolierung.</p>
            <form className="mb-4">
              <div className="flex">
                <Input type="email" placeholder="Ihre E-Mail-Adresse" className="flex-grow px-4 py-2 rounded-l-md border-none focus:outline-none text-gray-900 placeholder:text-gray-500" />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-r-md whitespace-nowrap rounded-l-none">Anmelden</Button>
              </div>
            </form>
            <Link href="#" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
              <i className="ri-book-open-line mr-2"></i>
              <span>Magazin digital lesen</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">© {new Date().getFullYear()} WNP Medien GmbH. Alle Rechte vorbehalten.</p>
            {/* Optional: Add any other links or info here if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
