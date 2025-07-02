import AdvertisingBenefitsAndService from '@/components/sections/advertising-benefits-service';
import AdvertisingDescription from '@/components/sections/advertising-description';
import AdvertisingHero from '@/components/sections/advertising-hero';
import AudienceChart from '@/components/sections/audience-chart';
import FaqSection from '@/components/sections/faq-section';
import MoreAdvertisingOptions from '@/components/sections/more-advertising-options';

const WerbungPage = () => {
  return (
    <main>
      <AdvertisingHero />
      <AdvertisingBenefitsAndService />
      <AdvertisingDescription />
      <div id="formats">
        <AudienceChart />
      </div>
      <FaqSection />
      <MoreAdvertisingOptions />
    </main>
  );
};

export default WerbungPage;
