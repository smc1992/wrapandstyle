import { AboutHero } from '@/components/sections/about-hero';
import { AboutHistory } from '@/components/sections/about-history';
import AboutTeam from '@/components/sections/about-team';
import { AboutMissionVision } from '@/components/sections/about-mission-vision';
import { AboutFlagship } from '@/components/sections/about-flagship';

export default function UeberUnsPage() {
  return (
    <main>
      <AboutHero />
      <AboutHistory />
      <AboutMissionVision />
      <AboutFlagship />
      <AboutTeam />
      {/* Other sections will be added here */}
    </main>
  );
}
