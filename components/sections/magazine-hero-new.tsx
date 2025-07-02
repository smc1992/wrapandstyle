import React from 'react';

const MagazineHeroNew = () => {
  return (
    <section 
      className="relative py-20 md:py-32 bg-cover bg-center"
      style={{
        backgroundImage: 'url(/images/hero-background.jpg)',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(0,0,0,0.6)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-primary/20 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            Unser Magazin
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Von Profis für Profis und Enthusiasten
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-light">
            Entdecken Sie die neuesten Trends, Techniken und DIY-Anleitungen aus der Welt der Fahrzeugfolierung.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MagazineHeroNew;
