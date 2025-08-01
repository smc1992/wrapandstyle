import { getHerstellerProfileBySlug } from '@/app/(main)/hersteller/actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RiGlobalLine, RiPhoneLine, RiMapPinLine, RiMailLine, RiUserLine } from '@remixicon/react';
import InteractiveMap from '@/components/ui/interactive-map';
import { VideoPlayer } from '@/components/ui/video-player';

// This function generates metadata for the page
export async function generateMetadata({ params: { slug } }: { params: { slug: string } }): Promise<Metadata> {
  const profile = await getHerstellerProfileBySlug(slug);

  if (!profile) {
    return {
      title: 'Hersteller nicht gefunden',
      description: 'Das gesuchte Herstellerprofil konnte nicht gefunden werden.',
    };
  }

  return {
    title: `${profile.firma || 'Herstellerprofil'} | WRAPS Magazin`,
    description: profile.company_description || `Öffentliches Profil von ${profile.firma}.`,
    openGraph: {
      title: `${profile.firma || 'Herstellerprofil'} | WRAPS Magazin`,
      description: profile.company_description || `Öffentliches Profil von ${profile.firma}.`,
      images: profile.logo_url ? [profile.logo_url] : [],
    },
  };
}

// This function generates the page for a single hersteller based on their slug
export default async function HerstellerPublicProfilePage({ params: { slug } }: { params: { slug: string } }) {
  const profile = await getHerstellerProfileBySlug(slug);

  // If no profile is found, show a 404 page
  if (!profile) {
    notFound();
  }

  const fullAddress = profile.address || null;

  return (
    <>
      <main className="bg-gray-50 dark:bg-gray-900">
        {/* Visual Header */}
        <div className="relative bg-gray-800 h-48 md:h-64 flex items-center justify-center pt-14">
          <Image
            src="/images/hero-background.jpg"
            alt="Abstrakter Hintergrund für Hersteller-Profil"
            fill
            className="object-cover opacity-20"
          />
          <div className="relative text-center p-4">
            {profile.logo_url && (
              <div className="mx-auto bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-2xl w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-2 backdrop-blur-sm">
                <Image src={profile.logo_url} alt={`${profile.firma} Logo`} width={160} height={160} className="object-contain rounded-md" />
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight shadow-black [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">{profile.firma}</h1>
            <p className="text-lg text-cyan-300 mt-1 font-medium">Hersteller-Profil</p>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
            
            {/* Main Content (Left Column) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* About Us Section */}
              {profile.company_description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Über das Unternehmen</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{profile.company_description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Mission, Vision & History Section */}
              {(profile.mission_statement || profile.vision_statement || profile.company_history) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Unternehmenswerte & Geschichte</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 prose prose-gray dark:prose-invert max-w-none">
                    {profile.mission_statement && (
                      <div>
                        <h3 className="font-semibold text-lg">Unsere Mission</h3>
                        <p className="whitespace-pre-wrap">{profile.mission_statement}</p>
                      </div>
                    )}
                    {profile.vision_statement && (
                      <div>
                        <h3 className="font-semibold text-lg">Unsere Vision</h3>
                        <p className="whitespace-pre-wrap">{profile.vision_statement}</p>
                      </div>
                    )}
                    {profile.company_history && (
                      <div>
                        <h3 className="font-semibold text-lg">Unsere Geschichte</h3>
                        <p className="whitespace-pre-wrap">{profile.company_history}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Video Player */}
              {profile.video_url && (
                <Card>
                   <CardHeader>
                    <CardTitle>Imagevideo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer url={profile.video_url} />
                  </CardContent>
                </Card>
              )}

              {/* Product Categories Section */}
              {profile.product_categories && profile.product_categories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Produktkategorien</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {profile.product_categories.map((category) => (
                      <div key={category} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                        {category}
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
                  {profile.ansprechpartner && (
                    <div className="flex items-center gap-4">
                      <RiUserLine className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ansprechpartner</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{profile.ansprechpartner}</p>
                      </div>
                    </div>
                  )}
                  {profile.phone_number && (
                    <div className="flex items-center gap-4">
                      <RiPhoneLine className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Telefon</p>
                        <a href={`tel:${profile.phone_number}`} className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">{profile.phone_number}</a>
                      </div>
                    </div>
                  )}
                  {profile.webseite && (
                    <div className="flex items-center gap-4">
                      <RiGlobalLine className="h-6 w-6 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Webseite</p>
                        <a href={profile.webseite.startsWith('http') ? profile.webseite : `https://${profile.webseite}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline truncate">{profile.webseite.replace(/^(https?|ftp):\/\//, '')}</a>
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
