import { getPageBySlug, getAllPages } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import { Section, Container, Prose } from "@/components/craft";
import { siteConfig } from "@/site.config";

import type { Metadata } from "next";

// Revalidate pages every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const { data: pages, error } = await getAllPages();

  if (error || !pages) {
    console.error("Build Error: Failed to fetch pages for generateStaticParams.", error);
    return [];
  }

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const { data: page, error } = await getPageBySlug(slug);

  if (error || !page) {
    return {};
  }

  // Rank Math SEO Daten extrahieren, falls vorhanden
  const seo = page.rank_math_seo;

  const pageTitle = seo?.title || page.title.rendered;
  // Strip HTML tags for description, fallback to excerpt/content if no Rank Math description
  const pageDescription = seo?.description || (
    page.excerpt?.rendered
      ? page.excerpt.rendered.replace(/<[^>]*>/g, "").trim()
      : page.content.rendered
          .replace(/<[^>]*>/g, "")
          .trim()
          .slice(0, 200) + "..."
  );
  const canonicalUrl = seo?.canonical || `${siteConfig.site_domain}/pages/${page.slug}`;

  // OG Image URL - entweder von Rank Math oder die generierte
  let ogImageUrl = seo?.og_image;
  if (!ogImageUrl) {
    const ogUrlBuilder = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrlBuilder.searchParams.append("title", seo?.og_title || pageTitle);
    ogUrlBuilder.searchParams.append("description", seo?.og_description || pageDescription);
    ogImageUrl = ogUrlBuilder.toString();
  }
  
  const twitterImageUrl = seo?.twitter_image || ogImageUrl; // Fallback to OG image for Twitter

  // Define allowed types using 'as const' for stricter type inference
  const validOgTypes = ['article', 'website', 'book', 'profile', 'music.song', 'music.album', 'music.playlist', 'music.radio_station', 'video.movie', 'video.episode', 'video.tv_show', 'video.other'] as const;
  type OgType = typeof validOgTypes[number];
  let ogType: OgType = 'website'; // Default für Pages ist oft 'website'
  if (seo?.og_type && (validOgTypes as readonly string[]).includes(seo.og_type)) {
    ogType = seo.og_type as OgType;
  }

  const validTwitterCardTypes = ['summary_large_image', 'summary', 'player', 'app'] as const;
  type TwitterCardType = typeof validTwitterCardTypes[number];
  let twitterCard: TwitterCardType = 'summary_large_image'; // Default
  if (seo?.twitter_card_type && (validTwitterCardTypes as readonly string[]).includes(seo.twitter_card_type)) {
    twitterCard = seo.twitter_card_type as TwitterCardType;
  }

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo?.og_title || pageTitle,
      description: seo?.og_description || pageDescription,
      type: ogType,
      url: seo?.og_url || canonicalUrl,
      images: ogImageUrl ? [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: seo?.og_title || pageTitle,
        },
      ] : [],
    },
    twitter: {
      card: twitterCard,
      title: seo?.twitter_title || pageTitle,
      description: seo?.twitter_description || pageDescription,
      images: twitterImageUrl ? [twitterImageUrl] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { data: page, error } = await getPageBySlug(params.slug);

  if (error || !page) {
    notFound();
  }

  return (
    <Section>
      <Container>
        <Prose>
          <h2>{page.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
        </Prose>
      </Container>
    </Section>
  );
}
