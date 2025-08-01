import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HaendlerProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { RiGlobalLine, RiPhoneLine, RiMapPinLine, RiShieldStarLine, RiMailLine } from 'react-icons/ri';
import InteractiveMap from '@/components/ui/interactive-map';
import { VideoPlayer } from '@/components/ui/video-player';
import { Tables } from '@/lib/supabase/database.types';

export const revalidate = 0; // Ensure data is always fresh

async function getHaendlerProfileBySlug(slug: string): Promise<HaendlerProfile | null> {
  const supabase = await createClient();

  // Step 1: Fetch the main haendler data, excluding the problematic join
  const { data: haendlerData, error: haendlerError } = await supabase
    .from('haendler')
    .select(`
      *,
      haendler_brands ( brands ( id, name ) ),
      haendler_product_categories ( product_categories ( id, name ) )
    `)
    .eq('slug', slug)
    .single();

  if (haendlerError || !haendlerData) {
    console.error(`Error fetching haendler for slug "${slug}":`, haendlerError?.message);
    return null;
  }

  // Step 2: Fetch the related profile data (email) in a separate query
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', haendlerData.user_id)
    .single();

  // Log profile error but don't fail the whole page if only email is missing
  if (profileError) {
    console.error(`Error fetching profile email for user_id "${haendlerData.user_id}":`, profileError.message);
  }

  // Step 3: Combine the data manually
  const profile: HaendlerProfile = {
    ...haendlerData,
    email: profileData?.email || null,
    brands: haendlerData.haendler_brands.map((b: any) => b.brands),
    product_categories: haendlerData.haendler_product_categories.map((c: any) => c.product_categories),
  };

  return profile;
}

export default async function HaendlerPublicProfilePage({ params }: { params: { slug: string } }) {
  const haendlerProfile = await getHaendlerProfileBySlug(params.slug);

  if (!haendlerProfile) {
    notFound();
  }

  const fullAddress = haendlerProfile.address || null;

  return (
    <>
      <main className="bg-gray-50 dark:bg-gray-900">
        {/* Visual Header */}
        <div className="relative bg-gray-800 h-48 md:h-64 flex items-center justify-center pt-14">
          <Image 
            src="/images/hero-background.jpg" 
            alt="Abstrakter Hintergrund für Händler-Profil"
            fill
            className="object-cover opacity-20"
          />
          <div className="relative text-center p-4">
            {haendlerProfile.logo_url && (
              <div className="mx-auto bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-2xl w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-2 backdrop-blur-sm">
                <Image src={haendlerProfile.logo_url} alt={`${haendlerProfile.firma || 'Händler'} Logo`} width={160} height={160} className="object-contain rounded-md" />
              </div>
            )}
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 tracking-tight shadow-black [text-shadow:_0_2px_4px_var(--tw-shadow-color)]">{haendlerProfile.firma}</h1>
            <p className="text-lg text-cyan-300 mt-1 font-medium">Händler-Profil</p>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">

            {/* Main Content (Left Column) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* About Us Section */}
              {haendlerProfile.company_description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Über das Unternehmen</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{haendlerProfile.company_description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Video Player */}
              {haendlerProfile.video_url && (
                <Card>
                   <CardHeader>
                    <CardTitle>Imagevideo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <VideoPlayer url={haendlerProfile.video_url} />
                  </CardContent>
                </Card>
              )}

              {/* Brands Section */}
              {haendlerProfile.brands && haendlerProfile.brands.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Geführte Marken</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    {haendlerProfile.brands.map((brand) => (
                      <Badge key={brand.id} variant="secondary" className="text-base font-medium bg-blue-100 text-blue-800 hover:bg-blue-200">
                        <RiShieldStarLine className="mr-2 h-4 w-4"/>
                        {brand.name}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Product Categories Section */}
              {haendlerProfile.product_categories && haendlerProfile.product_categories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Produktkategorien</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    {haendlerProfile.product_categories.map((category) => (
                      <Badge key={category.id} variant="secondary" className="text-base font-medium bg-green-100 text-green-800 hover:bg-green-200">
                        <RiShieldStarLine className="mr-2 h-4 w-4"/>
                        {category.name}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              )}

            </div>

            {/* Sidebar (Right Column) */}
            <div className="lg:col-span-1 lg:sticky top-24 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Kontaktdaten</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {haendlerProfile.webseite && (
                    <div className="flex items-center">
                      <RiGlobalLine className="w-5 h-5 mr-3 text-gray-500" />
                      <Link href={haendlerProfile.webseite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">
                        {haendlerProfile.webseite}
                      </Link>
                    </div>
                  )}
                  {haendlerProfile.email && (
                    <div className="flex items-center">
                      <RiMailLine className="w-5 h-5 mr-3 text-gray-500" />
                      <a href={`mailto:${haendlerProfile.email}`} className="text-primary hover:underline break-all">
                        {haendlerProfile.email}
                      </a>
                    </div>
                  )}
                  {haendlerProfile.phone_number && (
                    <div className="flex items-center">
                      <RiPhoneLine className="w-5 h-5 mr-3 text-gray-500" />
                      <a href={`tel:${haendlerProfile.phone_number}`} className="text-primary hover:underline">
                        {haendlerProfile.phone_number}
                      </a>
                    </div>
                  )}
                  {fullAddress && (
                    <div className="flex items-start">
                      <RiMapPinLine className="w-5 h-5 mr-3 text-gray-500 mt-1" />
                      <span className="whitespace-pre-wrap">{fullAddress}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {fullAddress && (
                <Card>
                  <CardHeader>
                    <CardTitle>Standort</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 w-full rounded-lg overflow-hidden">
                      <InteractiveMap address={fullAddress} />
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>

          </div>
        </div>
      </main>
    </>
  );
}
