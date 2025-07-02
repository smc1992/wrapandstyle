// app/dashboard/folierer/portfolio/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getFoliererProfile } from '../data';
import { FoliererPortfolioForm } from '@/components/dashboard/folierer-portfolio-form';
import { getPortfolioImages } from './actions'; // Import the action to fetch images

export default async function PortfolioPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch profile and portfolio images in parallel
  const [profile, { data: portfolioImages, error: imagesError }] = await Promise.all([
    getFoliererProfile(user.id),
    getPortfolioImages()
  ]);

  if (imagesError) {
    // Optional: Zeige eine Fehlermeldung in der UI an
    console.error(imagesError);
    // Hier könnte man eine Fehlerkomponente zurückgeben
  }

  if (!profile) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Fehler</h1>
        <p>Ihr Folierer-Profil konnte nicht geladen werden. Bitte kontaktieren Sie den Support.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl mb-2">Portfolio verwalten</h1>
        <p className="text-muted-foreground mb-8">
          Laden Sie hier Ihr Logo und Ihre besten Arbeiten hoch, um potenzielle Kunden zu überzeugen.
        </p>
        <div className="p-8 border rounded-lg bg-card text-card-foreground">
          <FoliererPortfolioForm profile={profile} initialImages={portfolioImages || []} />
        </div>
      </div>
    </div>
  );
}
