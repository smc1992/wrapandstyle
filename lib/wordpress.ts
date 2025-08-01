import queryString from 'query-string';

// --- TYPE DEFINITIONS ---

export interface Tag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links: any;
}

export interface Category {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: any;
}

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [key: string]: string;
  };
}

export interface FeaturedMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
  };
}

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  rank_math_head?: string;
  jetpack_featured_media_url?: string;
  _embedded?: {
    author?: Author[];
    'wp:featuredmedia'?: FeaturedMedia[];
    'wp:term'?: (Category | Tag)[][];
  };
}

export interface Page {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: {
    rendered: string;
  };
  link: string;
  rank_math_head?: string;
  rank_math_seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    og_title?: string;
    og_description?: string;
    og_image?: any;
    og_url?: string;
    og_type?: string;
    twitter_card_type?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: any;
  };
}

export interface RankMathHead {
  title: string;
  description: string;
  canonical: string;
  // Add other RankMath properties as needed
}

export interface TeamMember {
  // Add TeamMember properties as needed
}

export interface Haendler {
  // Add Haendler properties as needed
}

// --- API HELPER FUNCTIONS ---

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL environment variable is not defined");
}

// Generic result type for all fetch operations
export type WordPressApiResult<T> = {
  data: T | null;
  error: string | null;
  headers?: Headers;
};

async function wordpressFetch<T>(endpoint: string, options: RequestInit = {}): Promise<WordPressApiResult<T>> {
  const url = `${API_URL}${endpoint}`;
  const userAgent = "WNP-Magazin Next.js Client";
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        ...options.headers,
      },
      signal: controller.signal,
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`WordPress API Error: ${response.status} ${response.statusText}`, { url, body: errorBody });
      return { data: null, error: `API request failed with status ${response.status}.` };
    }

    const data: T = await response.json();
    return { data, error: null, headers: response.headers };

  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`[wordpressFetch] Network Error for URL: ${url}`, error);
    if (error.name === 'AbortError') {
      return { data: null, error: 'Connection to the content server timed out.' };
    }
    return { data: null, error: `A network error occurred: ${error.message}` };
  }
}

// --- DATA FETCHING FUNCTIONS ---

export async function getRecentPosts(count: number = 5): Promise<WordPressApiResult<Post[]>> {
  const params = {
    per_page: count,
    orderby: 'date',
    order: 'desc',
    _embed: true,
  };
  const query = queryString.stringify(params);
  return wordpressFetch<Post[]>(`/wp-json/wp/v2/posts?${query}`);
}

export async function getAllPosts(params: Record<string, any> = {}): Promise<WordPressApiResult<Post[]>> {
  const defaultParams = { _embed: true, per_page: 100 };
  const query = queryString.stringify({ ...defaultParams, ...params });
  return wordpressFetch<Post[]>(`/wp-json/wp/v2/posts?${query}`);
}

export async function getPostBySlug(slug: string): Promise<WordPressApiResult<Post | null>> {
  const query = queryString.stringify({ slug, _embed: true });
  const result = await wordpressFetch<Post[]>(`/wp-json/wp/v2/posts?${query}`);
  if (result.error || !result.data || result.data.length === 0) {
    return { data: null, error: result.error || 'Post not found.' };
  }
  return { data: result.data[0], error: null };
}

export async function getAllCategories(): Promise<WordPressApiResult<Category[]>> {
  const query = queryString.stringify({ per_page: 100, hide_empty: true });
  return wordpressFetch<Category[]>(`/wp-json/wp/v2/categories?${query}`);
}

export async function getAllTags(): Promise<WordPressApiResult<Tag[]>> {
  const query = queryString.stringify({ per_page: 100, hide_empty: true });
  return wordpressFetch<Tag[]>(`/wp-json/wp/v2/tags?${query}`);
}

export async function getAllAuthors(): Promise<WordPressApiResult<Author[]>> {
  const query = queryString.stringify({ per_page: 100 });
  return wordpressFetch<Author[]>(`/wp-json/wp/v2/users?${query}`);
}

export async function getPageBySlug(slug: string): Promise<WordPressApiResult<Page | null>> {
  const query = queryString.stringify({ slug, _embed: true });
  const result = await wordpressFetch<Page[]>(`/wp-json/wp/v2/pages?${query}`);
  if (result.error || !result.data || result.data.length === 0) {
    return { data: null, error: result.error || 'Page not found.' };
  }
  return { data: result.data[0], error: null };
}

export async function getFeaturedMediaById(id: number): Promise<WordPressApiResult<FeaturedMedia>> {
  return wordpressFetch<FeaturedMedia>(`/wp-json/wp/v2/media/${id}`);
}

export async function getRankMathHead(url: string): Promise<WordPressApiResult<RankMathHead>> {
  const fullUrl = `/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(url)}`;
  return wordpressFetch<RankMathHead>(fullUrl);
}

export async function getAuthorById(id: number): Promise<WordPressApiResult<Author>> {
  return wordpressFetch<Author>(`/wp-json/wp/v2/users/${id}`);
}

export async function getCategoryById(id: number): Promise<WordPressApiResult<Category>> {
  return wordpressFetch<Category>(`/wp-json/wp/v2/categories/${id}`);
}

export async function getAllPages(params: Record<string, any> = {}): Promise<WordPressApiResult<Page[]>> {
  const defaultParams = { _embed: true, per_page: 100 };
  const query = queryString.stringify({ ...defaultParams, ...params });
  return wordpressFetch<Page[]>(`/wp-json/wp/v2/pages?${query}`);
}

export async function getRelatedPosts({ postId, categoryIds, limit = 3 }: { postId: number; categoryIds: number[]; limit?: number; }): Promise<WordPressApiResult<Post[]>> {
  if (!categoryIds || categoryIds.length === 0) {
    return { data: [], error: null };
  }
  const query = queryString.stringify({
    categories: categoryIds.join(','),
    exclude: postId,
    per_page: limit,
    _embed: true,
  });
  return wordpressFetch<Post[]>(`/wp-json/wp/v2/posts?${query}`);
}

