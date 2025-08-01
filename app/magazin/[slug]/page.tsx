import React from 'react';
import {
  getPostBySlug,
  getAuthorById,
  getCategoryById,
  getFeaturedMediaById,
  getRelatedPosts,
  getAllPosts,
} from "@/lib/wordpress";

import { Section, Container, Article, Prose } from "@/components/craft";
import Image from "next/image";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Balancer from "react-wrap-balancer";

import type { Metadata } from "next";
import { Post } from "@/lib/wordpress.d";
import * as cheerio from 'cheerio';

export async function generateStaticParams() {
  const { data: posts, error } = await getAllPosts();

  if (error || !posts) {
    console.error("Error fetching posts for static params generation:", error);
    return [];
  }

  return posts.map((post: Post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { data: post, error } = await getPostBySlug(params.slug);

  if (error || !post) {
    return {
      title: "Fehler",
      description: "Der Beitrag konnte nicht gefunden werden.",
    };
  }

  const seo = post.rank_math_seo;

  const pageTitle = seo?.title || post.title.rendered;
  const pageDescription = seo?.description || post.excerpt.rendered.replace(/<[^>]*>/g, "").trim();
  const canonicalUrl = seo?.canonical || `${siteConfig.site_domain}/magazin/${post.slug}`;

  let ogImageUrl = seo?.og_image;
  if (!ogImageUrl) {
    const ogUrlBuilder = new URL(`${siteConfig.site_domain}/api/og`);
    ogUrlBuilder.searchParams.append("title", seo?.og_title || pageTitle);
    ogUrlBuilder.searchParams.append("description", seo?.og_description || pageDescription);
    ogImageUrl = ogUrlBuilder.toString();
  }
  
  const twitterImageUrl = seo?.twitter_image || ogImageUrl;

  const validOgTypes = ['article', 'website', 'book', 'profile', 'music.song', 'music.album', 'music.playlist', 'music.radio_station', 'video.movie', 'video.episode', 'video.tv_show', 'video.other'] as const;
  type OgType = typeof validOgTypes[number];
  let ogType: OgType = 'article';
  if (seo?.og_type && (validOgTypes as readonly string[]).includes(seo.og_type)) {
    ogType = seo.og_type as OgType;
  }

  const validTwitterCardTypes = ['summary_large_image', 'summary', 'player', 'app'] as const;
  type TwitterCardType = typeof validTwitterCardTypes[number];
  let twitterCard: TwitterCardType = 'summary_large_image';
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
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630, alt: seo?.og_title || pageTitle }] : [],
    },
    twitter: {
      card: twitterCard,
      title: seo?.twitter_title || pageTitle,
      description: seo?.twitter_description || pageDescription,
      images: twitterImageUrl ? [twitterImageUrl] : [],
    },
  };
}

import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const { data: post, error: postError } = await getPostBySlug(params.slug);

  if (postError || !post) {
    notFound();
  }

  const [
    { data: featuredMedia, error: mediaError },
    { data: author, error: authorError },
    { data: category, error: categoryError },
  ] = await Promise.all([
    post.featured_media ? getFeaturedMediaById(post.featured_media) : Promise.resolve({ data: null, error: null }),
    getAuthorById(post.author),
    post.categories.length > 0 ? getCategoryById(post.categories[0]) : Promise.resolve({ data: null, error: null }),
  ]);

  // Post author and category are critical for rendering the page.
  if (authorError || !author || categoryError || !category) {
    console.error("Error fetching critical post details", { authorError, categoryError });
    notFound();
  }

  // Media error is not critical, we can render without a hero image.
  if (mediaError) {
    console.error("Error fetching featured media", { mediaError });
  }

  const { data: relatedPosts, error: relatedPostsError } = await getRelatedPosts(category.id, post.id);

  if (relatedPostsError) {
      console.error("Error fetching related posts", relatedPostsError);
      // Non-critical, we can still render the page without related posts
  }

  const date = new Date(post.date).toLocaleDateString("de-DE", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Generate Table of Contents and update content with IDs
  const toc: { text: string; slug: string }[] = [];
  const $ = cheerio.load(post.content.rendered);

  $('h2').each((i, el) => {
    const text = $(el).text();
    const slug = text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
    $(el).attr('id', slug);
    toc.push({ text, slug });
  });

  const contentWithIds = $.html();

  return (
    <main>
      {/* Hero Section */}
      <section
        className="article-hero relative text-white py-20 flex items-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url('${featuredMedia?.source_url || ''}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 z-10">
          <div className="glass-effect max-w-4xl mx-auto rounded-xl p-8 border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm breadcrumbs mb-4">
                  <ul className="flex items-center gap-2 text-white/80">
                    <li><Link href="/" className="hover:text-white">Home</Link></li>
                    <li><i className="ri-arrow-right-s-line"></i></li>
                    <li><Link href="/magazin" className="hover:text-white">Magazin</Link></li>
                    <li><i className="ri-arrow-right-s-line"></i></li>
                    <li className="font-semibold text-white">{category.name}</li>
                  </ul>
                </div>
                <Link href={`/magazin/?category=${category.id}`} className={cn(badgeVariants({ variant: "default" }), "bg-primary/80 hover:bg-primary text-primary-foreground !no-underline")}>
                  {category.name}
                </Link>
                <h1 className="text-3xl md:text-5xl font-bold mt-4 !leading-tight" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
              </div>
              <div className="flex flex-col items-center gap-2 text-white/80 ml-4">
                <span className="text-sm">Teilen</span>
                <a href="#" className="hover:text-white"><i className="ri-facebook-box-fill text-xl"></i></a>
                <a href="#" className="hover:text-white"><i className="ri-twitter-x-fill text-xl"></i></a>
                <a href="#" className="hover:text-white"><i className="ri-linkedin-box-fill text-xl"></i></a>
                <a href="#" className="hover:text-white"><i className="ri-link text-xl"></i></a>
              </div>
            </div>
            <div className="flex items-center mt-6 pt-6 border-t border-white/20">
              {author.avatar_urls && <Image src={author.avatar_urls['96']} alt={author.name} width={48} height={48} className="rounded-full mr-4" />}
              <div>
                <p className="font-semibold">{author.name}</p>
                <p className="text-sm text-white/80">Veröffentlicht am {date}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <Section>
        <Container className="grid lg:grid-cols-12 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-8">
            <Article dangerouslySetInnerHTML={{ __html: contentWithIds }} />
            {/* Author Box at the end */}
            <div className="mt-12 p-6 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center">
                {author.avatar_urls && <Image src={author.avatar_urls['96']} alt={author.name} width={80} height={80} className="rounded-full mr-6" />}
                <div>
                    <p className="text-sm text-slate-500">Geschrieben von</p>
                    <h4 className="font-bold text-xl text-slate-900 dark:text-white">{author.name}</h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-2" dangerouslySetInnerHTML={{ __html: author.description || '' }} />
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky top-24 h-fit">
            <div className="space-y-8">
                {/* Table of Contents */}
                {toc.length > 0 && (
                  <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <h3 className="font-bold mb-4">In diesem Artikel</h3>
                      <ul className="space-y-2 text-sm">
                        {toc.map((item) => (
                          <li key={item.slug}>
                            <a href={`#${item.slug}`} className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors hover:underline">
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                  </div>
                )}
                {/* Related Articles */}
                <div className="p-6 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <h3 className="font-bold mb-4">Verwandte Artikel</h3>
                  <div className="space-y-4">
                    {relatedPosts && relatedPosts.length > 0 ? (
                      relatedPosts.map((relatedPost: Post) => {
                        const relatedPostMedia = relatedPost._embedded?.['wp:featuredmedia']?.[0];
                        return (
                          <Link key={relatedPost.id} href={`/magazin/${relatedPost.slug}`} className="flex items-center gap-4 group">
                            {relatedPostMedia?.source_url && (
                              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md">
                                <Image
                                  src={relatedPostMedia.source_url}
                                  alt={relatedPost.title.rendered}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: relatedPost.title.rendered }} />
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-500">Keine verwandten Artikel gefunden.</p>
                    )}
                  </div>
                </div>
                {/* CTA Placeholder */}
                <div className="p-6 rounded-xl bg-primary/10 text-center">
                    <h3 className="font-bold text-primary">Werden Sie Premium-Mitglied</h3>
                    <p className="text-sm mt-2">Erhalten Sie exklusiven Zugang zu detaillierten Anleitungen und Branchen-Insights.</p>
                    <Link href="/premium" className={cn(badgeVariants({ variant: 'default' }), 'mt-4 bg-primary hover:bg-primary/90 text-primary-foreground !no-underline')}>Jetzt upgraden</Link>
                </div>
            </div>
          </aside>
        </Container>
      </Section>
    </main>
  );
}
