"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post, Category, FeaturedMedia } from '@/lib/wordpress.d';

// Helper function to extract featured image URL and alt text
function getFeaturedImage(post: Post): { src: string | null; alt: string } {
  const media = post._embedded?.['wp:featuredmedia']?.[0] as FeaturedMedia | undefined;
  const sourceUrl = media?.source_url;
  const src = (sourceUrl && sourceUrl.trim() !== "") ? sourceUrl : null;
  const alt = media?.alt_text || post.title.rendered;
  return { src, alt };
}

// Helper function to get category name
function getCategoryName(post: Post): string {
  const categoryArray = post._embedded?.['wp:term']?.[0] as Category[] | undefined;
  return categoryArray?.[0]?.name || 'Allgemein';
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTimeMinutes} Min. Lesezeit`;
}

interface MagazineFilterProps {
  posts: Post[];
  categories: Category[];
}

export function MagazineFilter({ posts, categories }: MagazineFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const categoriesWithPosts = useMemo(() => {
    const postCategoryIds = new Set(posts.flatMap(post => post.categories));
    return categories.filter(category => postCategoryIds.has(category.id));
  }, [posts, categories]);

  const filteredPosts = useMemo(() => {
    const relevantPosts = selectedCategory === null
      ? posts
      : posts.filter(post => post.categories.includes(selectedCategory));
    return relevantPosts.slice(0, 6); // Show 6 posts to match template
  }, [posts, selectedCategory]);

  return (
    <div>
      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedCategory === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}>
          Alle Artikel
        </button>
        {categoriesWithPosts.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}>
            {category.name}
          </button>
        ))}
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post: Post) => {
            const featuredImage = getFeaturedImage(post);
            const categoryName = getCategoryName(post);
            const readingTime = calculateReadingTime(post.content.rendered);

            return (
              <div key={post.id} className="group flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg">
                <Link href={`/magazin/${post.slug}`} className="block overflow-hidden">
                  <div className="relative w-full h-56 bg-muted">
                    {featuredImage.src ? (
                      <Image
                        src={featuredImage.src}
                        alt={featuredImage.alt}
                        fill
                        className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ri-image-line text-4xl text-muted-foreground"></i>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                    {categoryName}
                  </span>
                  <Link href={`/magazin/${post.slug}`} className="block">
                    <h3 className="text-xl font-bold mt-1 mb-3 leading-snug group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                  </Link>
                  <div className="text-muted-foreground mb-4 text-sm line-clamp-3 flex-grow" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                  <div className="flex justify-between items-center mt-auto pt-4 border-t">
                    <span className="text-sm text-muted-foreground">{readingTime}</span>
                    <Link href={`/magazin/${post.slug}`} className="text-primary font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Weiterlesen
                      <i className="ri-arrow-right-line ml-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}
