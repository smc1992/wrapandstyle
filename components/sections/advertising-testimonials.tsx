import TestimonialSlider from './testimonial-slider';

const AdvertisingTestimonials = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-primary font-medium mb-2">DAS SAGEN UNSERE PARTNER</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Erfolgsgeschichten, die für sich sprechen</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Langfristige Partnerschaften und messbare Erfolge sind unser größter Ansporn. Überzeugen Sie sich selbst.</p>
        </div>
        <TestimonialSlider />
      </div>
    </section>
  );
};

export default AdvertisingTestimonials;
