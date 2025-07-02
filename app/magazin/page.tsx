import {
  getAllPosts,
  getAllAuthors,
  getAllTags,
  getAllCategories,
  searchAuthors,
  searchTags,
  searchCategories,
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
import MagazineHeroNew from "@/components/sections/magazine-hero-new";
import { PostCard } from "@/components/magazin/post-card";
import { FilterPosts } from "@/components/magazin/filter";
import { SearchInput } from "@/components/magazin/search-input";
import { MainFeaturedPostCard } from "@/components/magazin/main-featured-post-card";
import { SecondaryFeaturedPostCard } from "@/components/magazin/secondary-featured-post-card";
import { Sidebar } from "@/components/magazin/sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Magazin",
  description: "Aktuelle Trends, Techniken und Expertenwissen rund um die Fahrzeugfolierung",
};

export const dynamic = "auto";
export const revalidate = 600;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    author?: string;
    tag?: string;
    category?: string;
    page?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const { author, tag, category, page: pageParam, search } = params;

  const [allPosts, authors, tags, categories] = await Promise.all([
    getAllPosts({ author, tag, category, search }),
    getAllAuthors(),
    getAllTags(),
    getAllCategories(),
  ]);

  const showFeaturedSection = !author && !tag && !category && !search;
  const featuredPosts = showFeaturedSection ? allPosts.slice(0, 3) : [];
  const mainFeaturedPost = featuredPosts[0];
  const secondaryFeaturedPosts = featuredPosts.slice(1, 3);
  const regularPosts = showFeaturedSection ? allPosts.slice(3) : allPosts;

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);
  const paginatedPosts = regularPosts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  const createPaginationUrl = (newPage: number) => {
    const urlParams = new URLSearchParams();
    if (newPage > 1) urlParams.set("page", newPage.toString());
    if (category) urlParams.set("category", category);
    if (author) urlParams.set("author", author);
    if (tag) urlParams.set("tag", tag);
    if (search) urlParams.set("search", search);
    return `/magazin${urlParams.toString() ? `?${urlParams.toString()}` : ""}`;
  };

  return (
    <>
      <MagazineHeroNew />

      <div className="bg-white sticky top-14 z-40 shadow-sm">
        <Container className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto">
              <SearchInput defaultValue={search} />
            </div>
            <div className="w-full md:w-auto">
              <FilterPosts
                authors={authors}
                tags={tags}
                categories={categories}
                selectedAuthor={author}
                selectedTag={tag}
                selectedCategory={category}
              />
            </div>
          </div>
        </Container>
      </div>

      {showFeaturedSection && mainFeaturedPost && (
        <Section className="py-12">
          <Container>
            <h2 className="text-2xl font-bold mb-8">Neueste Artikel</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MainFeaturedPostCard post={mainFeaturedPost} />
              </div>
              <div className="space-y-8">
                {secondaryFeaturedPosts.map((post) => (
                  <SecondaryFeaturedPostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section className="py-12">
        <Container>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-8">
                {showFeaturedSection ? "Alle Artikel" : "Ergebnisse"}
              </h2>
              {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {paginatedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <p>Keine Beiträge für Ihre Auswahl gefunden.</p>
              )}

              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious href={createPaginationUrl(page - 1)} />
                        </PaginationItem>
                      )}
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href={createPaginationUrl(i + 1)}
                            isActive={page === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      {page < totalPages && (
                        <PaginationItem>
                          <PaginationNext href={createPaginationUrl(page + 1)} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>

            <Sidebar categories={categories} />
          </div>
        </Container>
      </Section>
    </>
  );
}
