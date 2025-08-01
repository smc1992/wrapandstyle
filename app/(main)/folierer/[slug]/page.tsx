import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { FoliererProfile, DetailedService, Testimonial, Certificate } from '@/lib/types';

export const revalidate = 0; // Disable caching for this page
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { RiGlobalLine, RiPhoneLine, RiMapPinLine, RiUserLine, RiDoubleQuotesL, RiAwardLine, RiCheckboxCircleLine, RiFocus3Line, RiEyeLine, RiMailLine } from 'react-icons/ri';
import { PublicPortfolioGallery } from '@/components/public-portfolio-gallery';
import InteractiveMap from '@/components/ui/interactive-map';
import { VideoPlayer } from '@/components/ui/video-player';

// This function generates the page for a single folierer based on their slug
export default async function FoliererPublicProfilePage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the profile data using the slug from the URL
  const { data: profile, error: profileError } = await supabase
    .from('folierer')
    .select('*, mission_statement, vision_statement, company_history')
    .eq('slug', params.slug)
    .single();

  // If no profile is found or there's an error, show a 404 page
  if (profileError || !profile) {
    notFound();
  }
  const foliererProfile = profile as FoliererProfile;

  // Fetch portfolio images for this user
  const { data: portfolioImages, error: imagesError } = await supabase
    .from('portfolio_images')
    .select('id, image_url, title')
    .eq('user_id', foliererProfile.user_id)
    .order('created_at', { ascending: false });

  // Fetch testimonials for this user
  const { data: testimonials, error: testimonialsError } = await supabase
    .from('testimonials')
    .select('id, author_name, author_company, testimonial_text')
    .eq('user_id', foliererProfile.user_id)
    .order('created_at', { ascending: false });

  // Fetch certificates for this user
  const { data: certificates, error: certificatesError } = await supabase
    .from('certificates')
    .select('id, title, issuer, issue_date, image_url')
    .eq('user_id', foliererProfile.user_id)
    .order('issue_date', { ascending: false });

  // Fetch detailed services
  const { data: detailedServices, error: servicesError } = await supabase
    .from('folierer_services')
    .select('id, title, description, icon')
    .eq('user_id', foliererProfile.user_id)
    .order('created_at', { ascending: true });
  
  if (imagesError) {
    console.error('Error fetching portfolio images:', imagesError.message);
    // We don't call notFound() here, so the page can still render without images
  }

  const fullAddress = foliererProfile.address || null;

  return (
    <>
      <main className="bg-gray-50 dark:bg-gray-900">
      {/* Visual Header */}
      <div className="relative bg-gray-800 h-48 md:h-64 flex items-center justify-center pt-14">
        <Image 
          src="/images/hero-background.jpg" 
          alt="Abstrakter Hintergrund für Folierer-Profil"
          fill
          className="object-cover opacity-20"
        />
        <div className="relative text-center p-4">
          {foliererProfile.logo_url && (
            <div className="mx-auto bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-2xl w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-2 backdrop-blur-sm">
              <Image src={foliererProfile.logo_url} alt={`${foliererProfile.firma} Logo`} width={160} height={160} className="object-contain rounded-md" />
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight shadow-black [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">{foliererProfile.firma}</h1>
          <p className="text-lg text-cyan-300 mt-1 font-medium">Folierer-Profil</p>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-12 px-4">

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Us Section */}
            {(foliererProfile.mission_statement || foliererProfile.vision_statement || foliererProfile.company_history || foliererProfile.company_description) && (
              <Card>
                <CardHeader>
                  <CardTitle>Über unser Unternehmen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 text-base">
                  {foliererProfile.mission_statement && (
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-lg p-3 flex-shrink-0">
                        <RiFocus3Line className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Unsere Mission</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{foliererProfile.mission_statement}</p>
                      </div>
                    </div>
                  )}
                  {foliererProfile.vision_statement && (
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 rounded-lg p-3 flex-shrink-0">
                        <RiEyeLine className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Unsere Vision</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{foliererProfile.vision_statement}</p>
                      </div>
                    </div>
                  )}
                  {foliererProfile.company_history && (
                    <div className="pt-8 border-t dark:border-gray-700">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Unsere Geschichte</h3>
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{foliererProfile.company_history}</p>
                      </div>
                    </div>
                  )}
                  {/* Fallback for old company_description */}
                  {foliererProfile.company_description && !foliererProfile.mission_statement && !foliererProfile.vision_statement && !foliererProfile.company_history && (
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{foliererProfile.company_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Video Player */}
            {foliererProfile.video_url && (
              <Card>
                 <CardHeader>
                  <CardTitle>Imagevideo</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoPlayer url={foliererProfile.video_url} />
                </CardContent>
              </Card>
            )}

            {/* Detailed Services Section */}
            {detailedServices && detailedServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Unsere Dienstleistungen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {detailedServices.map((service: DetailedService) => (
                    <div key={service.id} className="flex items-start gap-4">
                      <RiCheckboxCircleLine className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                        <p className="text-gray-600 mt-1 leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Portfolio Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <PublicPortfolioGallery images={portfolioImages || []} />
              </CardContent>
            </Card>

            {/* Testimonials Section */}
            {testimonials && testimonials.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Was unsere Kunden sagen</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((testimonial) => (
                    <figure key={testimonial.id} className="relative bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-cyan-500/10 transition-shadow duration-300 overflow-hidden">
                      <RiDoubleQuotesL className="absolute top-3 left-3 h-16 w-16 text-gray-200/50 dark:text-gray-700/50" />
                      <blockquote className="relative z-10 text-gray-700 dark:text-gray-300 italic">
                        {`"${testimonial.testimonial_text}"`}
                      </blockquote>
                      <figcaption className="relative z-10 mt-4 text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author_name}</p>
                        {testimonial.author_company && (
                          <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">{testimonial.author_company}</p>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Certificates Section */}
            {certificates && certificates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Zertifikate & Auszeichnungen</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="border dark:border-gray-700 bg-white dark:bg-gray-800/50 rounded-xl p-4 flex items-center gap-5 hover:shadow-lg hover:border-cyan-500/50 transition-all duration-300">
                      {cert.image_url ? (
                        <Image src={cert.image_url} alt={cert.title} width={64} height={64} className="rounded-lg object-contain flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <RiAwardLine className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h3 className="font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cert.issuer}</p>
                        {cert.issue_date && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(cert.issue_date).toLocaleDateString('de-DE')}</p>}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar (Right Column) */}
          <aside className="lg:sticky top-28 space-y-8 self-start">
            <Card className="bg-white dark:bg-gray-800/50 shadow-lg border-t-4 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-xl">Kontakt & Standort</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {foliererProfile.ansprechpartner && (
                  <div className="flex items-center gap-4">
                    <RiUserLine className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ansprechpartner</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{foliererProfile.ansprechpartner}</p>
                    </div>
                  </div>
                )}
                {foliererProfile.phone_number && (
                  <div className="flex items-center gap-4">
                    <RiPhoneLine className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                      <a href={`tel:${foliererProfile.phone_number}`} className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">{foliererProfile.phone_number}</a>
                    </div>
                  </div>
                )}
                {foliererProfile.webseite && (
                  <div className="flex items-center gap-4">
                    <RiGlobalLine className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Webseite</p>
                      <a href={foliererProfile.webseite} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline truncate">{foliererProfile.webseite.replace(/^(https?|ftp):\/\//, '')}</a>
                    </div>
                  </div>
                )}
                {fullAddress && (
                  <div className="flex items-start gap-4 pt-5 border-t dark:border-gray-700">
                    <RiMapPinLine className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Adresse</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{fullAddress}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 border-t dark:border-gray-700">
                  <Button asChild className="w-full">
                      <Link href="/kontakt">
                          <RiMailLine className="mr-2 h-4 w-4" />
                          Kontakt aufnehmen
                      </Link>
                  </Button>
              </div>
            </Card>
            
            {fullAddress && (
              <Card>
                <CardContent className="p-0 overflow-hidden rounded-xl">
                  <InteractiveMap address={fullAddress} />
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </div>
      </main>
      
    </>
  );
}
