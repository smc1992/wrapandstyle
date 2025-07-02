'use client';

import { useState } from 'react';

const AdvertisingContact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Werbeanfrage von ${name}`);
    const body = encodeURIComponent(
      `Hallo,\n\nfolgende Anfrage wurde über das Kontaktformular gesendet:\n\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}\n\nViele Grüße`
    );
    window.location.href = `mailto:anzeigen@wrap-style.de?subject=${subject}&body=${body}`;
  };

  return (
    <section id="kontakt" className="py-16 bg-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-white/10 text-white font-semibold py-1 px-3 rounded-full mb-4">BEREIT FÜR DEN NÄCHSTEN SCHRITT?</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Starten Sie jetzt Ihre Kampagne</h2>
            <p className="text-lg text-gray-300 mb-6">Unser Team aus Branchen-Experten beratet Sie gerne unverbindlich und erstellt Ihnen ein individuelles Angebot, das perfekt auf Ihre Ziele zugeschnitten ist.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-primary/20 text-primary p-3 rounded-full mr-4"><i className="ri-phone-line text-2xl"></i></div>
                <div>
                  <p className="text-gray-400">Telefonische Beratung</p>
                  <a href="tel:+49123456789" className="font-semibold text-white hover:text-primary">+49 (0) 123 456 789</a>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/20 text-primary p-3 rounded-full mr-4"><i className="ri-mail-line text-2xl"></i></div>
                <div>
                  <p className="text-gray-400">Anfrage per E-Mail</p>
                  <a href="mailto:anzeigen@wrap-style.de" className="font-semibold text-white hover:text-primary">anzeigen@wrap-style.de</a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Direkte Anfrage</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900" 
                  placeholder="Ihr Name" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-Mail</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900" 
                  placeholder="ihre@email.de" 
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Ihre Nachricht</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary text-gray-900" 
                  placeholder="Welche Werbeformate interessieren Sie?"
                ></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-button font-medium">Anfrage senden</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvertisingContact;
