import { Suspense } from "react";
import type { Metadata } from "next";
import type { Post, Author, Category, Tag } from "@/lib/wordpress";
import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
} from "@/lib/wordpress";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Section, Container } from "@/components/craft";
import { PostCard } from "@/components/magazin/post-card";
import { MagazineStickyFilter } from "@/components/magazin/filter";
import { MainFeaturedPostCard } from "@/components/magazin/main-featured-post-card";
import { Sidebar } from "@/components/magazin/sidebar";

export const metadata: Metadata = {
  title: "WNP Magazin | News & Trends der Folierungsbranche",
  description:
    "Das WNP Magazin ist die zentrale Anlaufstelle für aktuelle Trends, Techniken und Expertenwissen rund um die Fahrzeugfolierung und Werbetechnik.",
};

// Revalidate every 10 minutes
export const revalidate = 600;

export default async function MagazinePage({
  searchParams,
}: {
  searchParams: {
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  };
}) {
  const authorSlug = searchParams.author;
  const tagSlug = searchParams.tag;
  const categorySlug = searchParams.category;
  const pageParam = searchParams.page;
  const search = searchParams.search;

  // 1. Fetch all required data in parallel
  const [
    { data: allPostsData, error: postsError },
    { data: authorsData, error: authorsError },
    { data: tagsData, error: tagsError },
    { data: categoriesData, error: categoriesError },
  ] = await Promise.all([
    getAllPosts({
      search,
      categories: categorySlug,
      tags: tagSlug,
      author: authorSlug,
      per_page: 100, // Fetch all posts for client-side pagination/filtering
    }),
    getAllAuthors(),
    getAllTags(),
    getAllCategories(),
  ]);

  // 2. Handle potential fetching errors
  if (postsError || authorsError || tagsError || categoriesError) {
    console.error("Error fetching data for magazine page:", {
      postsError,
      authorsError,
      tagsError,
      categoriesError,
    });
    return (
      <Section>
        <Container className="text-center py-20">
          <h1 className="text-2xl font-bold">Fehler beim Laden der Daten</h1>
          <p className="text-muted-foreground mt-2">
            Das Magazin konnte nicht geladen werden. Bitte versuchen Sie es später
            erneut.
          </p>
        </Container>
      </Section>
    );
  }

  // 3. Prepare data and state
  const allPosts: Post[] = allPostsData || [];
  const authors: Author[] = authorsData || [];
  const tags: Tag[] = tagsData || [];
  const categories: Category[] = categoriesData || [];

  const isFiltered = !!(authorSlug || tagSlug || categorySlug || search);
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 10; // Use 10 for a 2-column grid

  // The first post is only 'featured' if no filters are active.
  const featuredPost = !isFiltered && allPosts.length > 0 ? allPosts[0] : null;
  // If filtering, show all results. Otherwise, skip the featured post.
  const gridPosts = isFiltered ? allPosts : allPosts.slice(1);

  const totalPages = Math.ceil(gridPosts.length / postsPerPage);
  const paginatedPosts = gridPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // 4. Helper function for pagination links
  const createPaginationUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `/magazin?${params.toString()}`;
  };

  return (
    <>
      <Section>
        <Container>
          <MagazineStickyFilter
        categories={categories}
        tags={tags}
        authors={authors}
        selectedAuthor={searchParams.author}
        selectedTag={searchParams.tag}
        selectedCategory={searchParams.category}
      />
        </Container>
      </Section>
      <Suspense fallback={<div className="container mx-auto px-4 mt-8 text-center"><p>Beiträge werden geladen...</p></div>}>
        <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Featured Post */}
            {!isFiltered && currentPage === 1 && featuredPost && (
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">
                  Neueste Story
                </h2>
                <MainFeaturedPostCard post={featuredPost} categories={categories} />
              </section>
            )}

            {/* Grid Posts */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4">
                {isFiltered ? `Ergebnisse (${allPosts.length})` : "Weitere Artikel"}
              </h2>
              {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {paginatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} categories={categories} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  Keine Beiträge gefunden, die Ihren Kriterien
                  entsprechen.
                </p>
              )}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={createPaginationUrl(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={createPaginationUrl(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={createPaginationUrl(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 h-fit">
              <Sidebar categories={categories} tags={tags} />
            </div>
          </aside>
        </div>
      </div>
      </Suspense>
    </>
  );
}
