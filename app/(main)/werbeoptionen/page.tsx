import AdvertisingHero from '@/components/sections/advertising-hero';
import AdvertisingBenefits from '@/components/sections/advertising-benefits';
import AdvertisingFormats from '@/components/sections/advertising-formats';
import AdvertisingAudience from '@/components/sections/advertising-audience';
import AdvertisingTestimonials from '@/components/sections/advertising-testimonials';
import AdvertisingContact from '@/components/sections/advertising-contact';

export default function WerbeoptionenPage() {
  return (
    <div>
            <AdvertisingHero />
            <AdvertisingBenefits />
            <AdvertisingFormats />
            <AdvertisingAudience />
      <AdvertisingTestimonials />
      <AdvertisingContact />
    </div>
  );
}
