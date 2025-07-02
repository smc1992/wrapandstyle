// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

export type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
};

const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL environment variable is not defined");
}

function getUrl(path: string, query?: Record<string, any>) {
  const params = query ? querystring.stringify(query) : null;
  return `${baseUrl}${path}${params ? `?${params}` : ""}`;
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

async function wordpressFetch<T>(url: string): Promise<T> {
  const userAgent = "Next.js WordPress Client";

  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new WordPressAPIError(
      `WordPress API request failed: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
  }

  if (filterParams?.author) {
    query.author = filterParams.author;
  }

  if (filterParams?.tag) {
    query.tags = filterParams.tag;
  }

  if (filterParams?.category) {
    query.categories = filterParams.category;
  }

  const url = getUrl("/wp-json/wp/v2/posts", query);
  return wordpressFetch<Post[]>(url);
}

export async function getPostById(id: number): Promise<Post> {
  const url = getUrl(`/wp-json/wp/v2/posts/${id}`);
  return wordpressFetch<Post>(url);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const url = getUrl("/wp-json/wp/v2/posts", { slug });
  const response = await wordpressFetch<Post[]>(url);
  return response[0];
}



// Interface for the Team Member Custom Post Type
export interface TeamMember {
  id: number;
  title: {
    rendered: string; // Name of the team member
  };
  content: {
    rendered: string; // Biography/description
  };
  _embedded: {
    'wp:featuredmedia'?: {
      source_url: string;
      alt_text: string;
    }[];
  };
  acf: {
    position?: string;
    linkedin_url?: string;
    twitter_url?: string;
    instagram_url?: string;
    facebook_url?: string;
  };
}

// Function to fetch all team members
export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_API_URL environment variable is not set.');
  }

  try {
    // The endpoint for the 'team' custom post type. _embed fetches linked data like featured images.
    const teamResponse = await fetch(`${API_URL}/wp-json/wp/v2/team?_embed`);
    if (!teamResponse.ok) {
      // If the endpoint doesn't exist (e.g., CPT not set up), return empty array gracefully.
      if (teamResponse.status === 404) {
        console.warn('Team members endpoint not found (404). Please ensure the Custom Post Type is set up correctly in WordPress.');
        return [];
      }
      throw new Error(`Failed to fetch team members: ${teamResponse.statusText}`);
    }
    const teamMembers: TeamMember[] = await teamResponse.json();
    return teamMembers;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return []; // Return empty array on error to prevent site crash
  }
}

export async function getAllCategories(): Promise<Category[]> {
  // We use hide_empty=true to only fetch categories that have at least one post.
  const url = getUrl("/wp-json/wp/v2/categories", { hide_empty: true });
  return wordpressFetch<Category[]>(url);
}

export async function getCategoryById(id: number): Promise<Category> {
  const url = getUrl(`/wp-json/wp/v2/categories/${id}`);
  return wordpressFetch<Category>(url);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const url = getUrl("/wp-json/wp/v2/categories", { slug });
  const response = await wordpressFetch<Category[]>(url);
  return response[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { categories: categoryId });
  return wordpressFetch<Post[]>(url);
}

export async function getRelatedPosts(categoryId: number, currentPostId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", {
    categories: categoryId,
    per_page: 4, // Fetch 3 related posts + the current one which we'll filter out
    exclude: currentPostId,
    _embed: true, // Embed related data like featured image
  });
  const posts = await wordpressFetch<Post[]>(url);
  // Ensure the current post is not in the related posts list and limit to 3
  return posts.filter(post => post.id !== currentPostId).slice(0, 3);
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tagId });
  return wordpressFetch<Post[]>(url);
}

export async function getTagsByPost(postId: number): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", { post: postId });
  return wordpressFetch<Tag[]>(url);
}

export async function getAllTags(): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags");
  return wordpressFetch<Tag[]>(url);
}

export async function getTagById(id: number): Promise<Tag> {
  const url = getUrl(`/wp-json/wp/v2/tags/${id}`);
  return wordpressFetch<Tag>(url);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const url = getUrl("/wp-json/wp/v2/tags", { slug });
  const response = await wordpressFetch<Tag[]>(url);
  return response[0];
}

export async function getAllPages(): Promise<Page[]> {
  const url = getUrl("/wp-json/wp/v2/pages");
  return wordpressFetch<Page[]>(url);
}

export async function getPageById(id: number): Promise<Page> {
  const url = getUrl(`/wp-json/wp/v2/pages/${id}`);
  return wordpressFetch<Page>(url);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const url = getUrl("/wp-json/wp/v2/pages", { slug });
  const response = await wordpressFetch<Page[]>(url);
  return response[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users");
  return wordpressFetch<Author[]>(url);
}

export async function getAuthorById(id: number): Promise<Author> {
  const url = getUrl(`/wp-json/wp/v2/users/${id}`);
  return wordpressFetch<Author>(url);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const url = getUrl("/wp-json/wp/v2/users", { slug });
  const response = await wordpressFetch<Author[]>(url);
  return response[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  const url = getUrl("/wp-json/wp/v2/posts", { author: authorId });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByAuthorSlug(
  authorSlug: string
): Promise<Post[]> {
  const author = await getAuthorBySlug(authorSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { author: author.id });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByCategorySlug(
  categorySlug: string
): Promise<Post[]> {
  const category = await getCategoryBySlug(categorySlug);
  const url = getUrl("/wp-json/wp/v2/posts", { categories: category.id });
  return wordpressFetch<Post[]>(url);
}

export async function getPostsByTagSlug(tagSlug: string): Promise<Post[]> {
  const tag = await getTagBySlug(tagSlug);
  const url = getUrl("/wp-json/wp/v2/posts", { tags: tag.id });
  return wordpressFetch<Post[]>(url);
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  const url = getUrl(`/wp-json/wp/v2/media/${id}`);
  return wordpressFetch<FeaturedMedia>(url);
}

export async function searchCategories(query: string): Promise<Category[]> {
  const url = getUrl("/wp-json/wp/v2/categories", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Category[]>(url);
}

export async function searchTags(query: string): Promise<Tag[]> {
  const url = getUrl("/wp-json/wp/v2/tags", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Tag[]>(url);
}

export async function searchAuthors(query: string): Promise<Author[]> {
  const url = getUrl("/wp-json/wp/v2/users", {
    search: query,
    per_page: 100,
  });
  return wordpressFetch<Author[]>(url);
}

export { WordPressAPIError };
